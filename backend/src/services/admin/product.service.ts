// admin/product.service.ts (no major changes needed, as handling is in controller; but ensure images are strings/paths)
import { Product, ProductSpec, ProductHighlight, ProductVariant } from "../../models";

export const getProducts = async () => {
  const products = await Product.find()
    .select("_id name slug price sale image is_active brandSlug categoryId")
    .populate("categoryId", "name")
    .populate("productVariants", "sizes images")
    .lean();

  const processed = products.map((p) => {
    // Tổng stock từ tất cả variant -> size -> quantity
    const totalStock =
      p.productVariants?.reduce((sum, variant: any) => {
        const variantStock = variant.sizes?.reduce(
          (subSum: number, size: any) => subSum + (size.quantity || 0),
          0
        );
        return sum + (variantStock || 0);
      }, 0) || 0;

    const variants = (p.productVariants as any[]) || [];
    const firstVariantImage = variants[0]?.images?.[0] || null;

    const cleanedVariants = variants.map((v) => {
      const { images, ...rest } = v;
      return rest;
    });

    const finalPrice = p.sale && p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;

    return {
      ...p,
      productVariants: cleanedVariants,
      finalPrice,
      totalStock,
      image: firstVariantImage,
    };
  });

  return processed;
};

// 🟢 Lấy chi tiết 1 sản phẩm
export const getProductById = async (id: string) => {
  return Product.findById(id)
    .populate("categoryId", "name")
    .populate("brandId", "name")
    .populate("productVariants")
    .populate("productSpecifications")
    .populate("productHighlights")
    .lean();
};

// 🟢 Tạo sản phẩm mới
export const createProduct = async (data: any) => {
  try {
    // 1️⃣ Tạo product chính (loại bỏ sub-arrays)
    const { productSpecifications, productHighlights, productVariants, ...productMainData } = data;
    const product = new Product(productMainData);
    await product.save();

    // 2️⃣ Tạo sub-documents với productId
    if (productSpecifications && productSpecifications.length > 0) {
      await ProductSpec.insertMany(
        productSpecifications.map((s: any) => ({ ...s, productId: product._id }))
      );
    }

    if (productHighlights && productHighlights.length > 0) {
      await ProductHighlight.insertMany(
        productHighlights.map((h: any) => ({ ...h, productId: product._id }))
      );
    }

    if (productVariants && productVariants.length > 0) {
      const savedVariants = await ProductVariant.insertMany(
        productVariants.map((v: any) => ({ ...v, productId: product._id }))
      );
      // Set defaultVariantId to first variant if exists
      if (savedVariants.length > 0) {
        product.defaultVariantId = savedVariants[0]._id;
        await product.save();
      }
    }

    // 3️⃣ Trả về full populated product
    return await getProductById(product._id.toString());
  } catch (err) {
    throw err;
  }
};

// 🟢 Cập nhật sản phẩm + các bảng liên quan
export const updateProduct = async (id: string, data: any) => {
  try {
    // 1️⃣ Update bảng chính
    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product) throw new Error("Product not found");

    // 2️⃣ Update bảng con
    if (data.productSpecs) {
      await ProductSpec.deleteMany({ productId: id });
      await ProductSpec.insertMany(data.productSpecs.map((s: any) => ({ ...s, productId: id })));
    }

    if (data.productHighlights) {
      await ProductHighlight.deleteMany({ productId: id });
      await ProductHighlight.insertMany(
        data.productHighlights.map((h: any) => ({ ...h, productId: id }))
      );
    }

    if (data.productVariants) {
      await ProductVariant.deleteMany({ productId: id });
      await ProductVariant.insertMany(
        data.productVariants.map((v: any) => ({ ...v, productId: id }))
      );
    }

    return product;
  } catch (err) {
    throw err;
  }
};

// 🟢 Xóa sản phẩm
export const deleteProduct = async (id: string) => {
  return Product.findByIdAndDelete(id);
};

export const getProductStats = async () => {
  const [totalProducts, activeProducts, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ is_active: true }),
    ProductVariant.aggregate([
      { $unwind: "$sizes" },
      { $match: { "sizes.quantity": { $lt: 5 } } }, // Low stock < 5
      { $group: { _id: "$productId" } },
      { $count: "lowStockProducts" },
    ]).then((res) => res[0]?.lowStockProducts || 0),
  ]);

  return {
    totalProducts,
    activeProducts,
    lowStockProducts,
  };
};
