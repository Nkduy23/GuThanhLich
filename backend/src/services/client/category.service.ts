import { Category, Product } from "../../models";

export const getNavCategory = async () => {
  return Category.find().select("name slug parentSlug").lean();
};

// nin: not in
export const getAllParentCategories = async () => {
  return Category.find({ parentSlug: null, slug: { $nin: ["khuyen-mai", "new", "gu"] } })
    .select("name slug image")
    .lean();
};

export const getFeaturedCategories = async () => {
  return Category.find({ isFeatured: true }).select("name title description slug").lean();
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;

  const products = await Product.find({ categorySlug: slug })
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

  const processed = products.map((p: any) => ({
    ...p,
    defaultVariantId: {
      ...p.defaultVariantId,
      images: p.defaultVariantId?.images?.length ? [p.defaultVariantId.images[0]] : [],
    },
  }));

  return { ...category, products: processed };
};
