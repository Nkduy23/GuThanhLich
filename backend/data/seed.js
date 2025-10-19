import { MongoClient, ObjectId } from "mongodb";
import { readFileSync } from "fs";
import { access } from "fs/promises";
import slugify from "slugify";
import { constants } from "fs";
import JSON5 from "json5";

async function seedCollection(db, collectionName, filePath) {
  try {
    await access(filePath, constants.F_OK); // Sử dụng constants.F_OK
    const rawData = JSON5.parse(readFileSync(filePath, "utf-8"));
    const data = parseObjectIds(rawData);
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
    await collection.insertMany(data);
    console.log(`✅ Seeded ${collectionName}`);
  } catch (err) {
    console.error(`❌ Error seeding ${collectionName}:`, err.message);
    throw err;
  }
}

function parseObjectIds(obj) {
  if (Array.isArray(obj)) {
    return obj.map(parseObjectIds);
  } else if (obj && typeof obj === "object") {
    if (obj.$oid) {
      return ObjectId.createFromHexString(obj.$oid);
    }
    const newObj = {};
    for (let key in obj) {
      newObj[key] = parseObjectIds(obj[key]);
    }
    return newObj;
  }
  return obj;
}

async function seedDatabase() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("guthanhlich");
    const session = client.startSession();
    session.startTransaction();

    try {
      // Hàm tạo slug từ name
      function slugify(text) {
        return text
          .toString()
          .normalize("NFD") // bỏ dấu tiếng Việt
          .replace(/[\u0300-\u036f]/g, "") // xóa ký tự dấu
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-") // thay khoảng trắng/ký tự đặc biệt = "-"
          .replace(/^-+|-+$/g, ""); // bỏ "-" thừa đầu/cuối
      }

      // --- Seed categories ---
      await seedCollection(db, "categories", "./categories.json5");
      const categories = JSON5.parse(readFileSync("./categories.json5", "utf-8"));
      const categoriesCol = db.collection("categories");

      // Thêm 2 cột isFeatured và order trước khi insert/update
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].isFeatured === undefined) {
          categories[i].isFeatured = false; // chỉ thêm nếu chưa có
        }
        if (categories[i].order === undefined) {
          categories[i].order = i + 1; // chỉ thêm nếu chưa có
        }
      }

      // Insert lại (hoặc update)
      for (let cate of categories) {
        const result = await categoriesCol.updateOne(
          { slug: cate.slug },
          { $set: { ...cate } },
          { upsert: true }
        );
      }

      const insertedCategories = await categoriesCol.find().toArray();
      const slugToId = Object.fromEntries(insertedCategories.map((cat) => [cat.slug, cat._id]));

      // Cập nhật parentId
      for (let cate of categories) {
        if (cate.parentSlug) {
          await categoriesCol.updateOne(
            { slug: cate.slug },
            { $set: { parentId: slugToId[cate.parentSlug] } }
          );
        }
      }

      // --- Seed brands ---
      await seedCollection(db, "brands", "./brands.json5");
      const brands = JSON5.parse(readFileSync("./brands.json5", "utf-8"));
      const brandsCol = db.collection("brands");
      const insertedBrands = await brandsCol.find().toArray();
      const brandSlugToId = Object.fromEntries(
        insertedBrands.map((brand) => [brand.slug, brand._id])
      );

      // --- Seed products ---
      await seedCollection(db, "products", "./products.json5");
      const products = JSON5.parse(readFileSync("./products.json5", "utf-8"));
      const productsCol = db.collection("products");

      function generateSlug(name, code) {
        const short = slugify(name, { lower: true, strict: true }).split("-").slice(0, 4).join("-");
        return `${short}-${code}`;
      }

      function generateProductCode(index) {
        // index: số thứ tự của sản phẩm trong file JSON
        const num = String(index + 1).padStart(3, "0"); // 001, 002, ...
        return `PRD${num}`;
      }

      // cập nhật thêm categoryId, brandId
      const updatedProducts = products.map((p, index) => ({
        ...p,
        code: generateProductCode(index),
        slug: generateSlug(p.name, generateProductCode(index)),
        categoryId: slugToId[p.categorySlug],
        brandId: brandSlugToId[p.brandSlug],
      }));

      await productsCol.deleteMany({});
      await productsCol.insertMany(updatedProducts);

      // build slug -> ObjectId map
      const insertedProducts = await productsCol.find().toArray();
      const slugToProductId = Object.fromEntries(insertedProducts.map((p) => [p.slug, p._id]));
      const codeToProductId = Object.fromEntries(insertedProducts.map((p) => [p.code, p._id]));

      // --- Seed variants ---
      const variants = JSON5.parse(readFileSync("./productVariants.json5", "utf-8"));
      const updatedVariants = variants.map((v) => {
        const { productSlug, productCode, ...rest } = v;

        const productId = productCode ? codeToProductId[productCode] : slugToProductId[productSlug];

        const product = insertedProducts.find((p) => p._id.toString() === productId.toString());

        return {
          ...rest,
          productId,
          variantName: `${product.name} - ${v.colorNameVi}`,
        };
      });

      const variantsCol = db.collection("productvariants");
      await variantsCol.deleteMany({});
      const insertedVariants = await variantsCol.insertMany(updatedVariants);

      // --- Cập nhật defaultVariantId cho products ---
      const groupedByProduct = {};
      insertedVariants.insertedIds &&
        Object.values(insertedVariants.insertedIds).forEach((variantId, index) => {
          const productId = updatedVariants[index].productId.toString();
          if (!groupedByProduct[productId]) {
            groupedByProduct[productId] = [];
          }
          groupedByProduct[productId].push(variantId);
        });

      for (const [productId, variantIds] of Object.entries(groupedByProduct)) {
        // Lấy variant đầu tiên làm default
        const defaultVariantId = variantIds[0];
        await productsCol.updateOne(
          { _id: new ObjectId(productId) },
          { $set: { defaultVariantId } }
        );
      }

      // --- Seed specs ---
      const specs = JSON5.parse(readFileSync("./productspecs.json5", "utf-8"));
      const updateSpecs = specs.map((s) => {
        const { productSlug, productCode, ...rest } = s;
        return {
          ...rest,
          productId: productCode ? codeToProductId[productCode] : slugToProductId[productSlug],
        };
      });
      await db.collection("productspecs").deleteMany({});
      await db.collection("productspecs").insertMany(updateSpecs);

      // --- Seed highlights ---
      const highlights = JSON5.parse(readFileSync("./productHighlights.json5", "utf-8"));
      const updateHighlights = highlights.map((h) => {
        const { productSlug, productCode, ...rest } = h;
        return {
          ...rest,
          productId: productCode ? codeToProductId[productCode] : slugToProductId[productSlug],
        };
      });
      await db.collection("producthighlights").deleteMany({});
      await db.collection("producthighlights").insertMany(updateHighlights);

      // --- Seed reviews ---
      const reviews = JSON5.parse(readFileSync("./reviews.json5", "utf-8"));
      const updatedReviews = reviews.map((r) => {
        const { productSlug, productCode, ...rest } = r;
        return {
          ...rest,
          productId: productCode ? codeToProductId[productCode] : slugToProductId[productSlug],
        };
      });
      await db.collection("reviews").deleteMany({});
      await db.collection("reviews").insertMany(updatedReviews);

      // --- Seed other collections ---
      const collections = [
        "users",
        "useraddresses",
        "cartitems",
        "orders",
        "orderdetails",
        "blogs",
        "vouchers",
      ];
      await Promise.all(collections.map((col) => seedCollection(db, col, `./${col}.json5`)));

      await session.commitTransaction();
      console.log("🎉 Database seeded successfully!");
    } catch (err) {
      await session.abortTransaction();
      console.error("❌ Transaction aborted due to error:", err.message);
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error("❌ Fatal error:", err.message);
  } finally {
    await client.close();
  }
}

seedDatabase();
