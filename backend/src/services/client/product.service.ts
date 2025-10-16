import { Product } from "../../models";
import { getFeaturedCategories } from "./category.service";

export const getActiveProducts = async () => {
  let products: any[] = [];
  try {
    products = await Product.find({ is_active: true })
      .select("name price defaultVariantId sale slug categorySlug tags is_new")
      .populate({
        path: "defaultVariantId",
        select: {
          color: 1,
          colorNameVi: 1,
          images: { $slice: 1 },
        },
      })
      .lean();
  } catch (error) {
    console.warn("⚠️ $slice projection không hỗ trợ, fallback sang map thủ công:", error);
  }

  // Fallback: nếu vẫn thấy images trả về đủ mảng thì cắt lại bằng JS
  return products.map((p: any) => ({
    ...p,
    defaultVariantId: {
      ...p.defaultVariantId,
      images: p.defaultVariantId?.images?.length ? [p.defaultVariantId.images[0]] : [],
    },
  }));
};

export const getProductsByCategorySlug = async (slug: string) => {
  const products = await getActiveProducts();

  if (slug === "khuyen-mai") {
    return products.filter((p) => p.sale && p.sale > 0);
  } else if (slug === "new") {
    return products.filter((p) => p.is_new);
  } else {
    return products.filter((p) => p.categorySlug === slug || p.tags?.includes(slug));
  }
};

export const getCategoryProducts = async () => {
  const categories = await getFeaturedCategories();

  const categoriesWithProducts = await Promise.all(
    categories.map(async (cat) => {
      const catProducts = await getProductsByCategorySlug(cat.slug || "");
      return { ...cat, products: catProducts.slice(0, 10) };
    })
  );

  return categoriesWithProducts;
};

export const getProductBySlug = async (slug: string) => {
  return Product.findOne({ slug })
    .populate("categoryId", "slug name")
    .populate({
      path: "productVariants",
      match: { is_active: true },
    })
    .populate("productSpecs")
    .populate("reviews")
    .populate("productHighlights")
    .lean();
};

export const getRelatedProducts = async (categorySlug: string, slug: string) => {
  const products = await Product.find({
    categorySlug,
    slug: { $ne: slug },
  })
    .populate({
      path: "defaultVariantId",
      select: {
        color: 1,
        colorNameVi: 1,
        images: { $slice: 1 },
      },
    })
    .limit(10)
    .lean();

  return products.map((p: any) => ({
    ...p,
    defaultVariantId: {
      ...p.defaultVariantId,
      images: p.defaultVariantId?.images?.length ? [p.defaultVariantId.images[0]] : [],
    },
  }));
};

export const getProductById = async (id: string) => {
  return Product.findById(id) // findById thay findOne
    .populate("categoryId", "slug name")
    .populate({
      path: "productVariants",
      match: { is_active: true },
    })
    .populate("productSpecs")
    .populate("reviews")
    .populate("productHighlights")
    .lean();
};

export const getProductByIdServiceTest = async (ids: string[]) => {
  try {
    const products = await Product.find({ _id: { $in: ids } })
      .select("_id name images") // Add defaultImage if your model has it: "_id name images defaultImage"
      .populate({
        path: "productVariants",
        model: "ProductVariant",
        match: { is_active: true },
        select: "_id color images sizes", // Select only needed fields for variants to optimize
      })
      .lean();
    return products;
  } catch (error) {
    console.error("Batch fetch error:", error);
    throw error;
  }
};
