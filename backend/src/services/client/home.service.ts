import { getFeaturedCategories, getAllParentCategories } from "./category.service";
import { getProductsByCategorySlug } from "./product.service";

export const getHomeData = async () => {
  const categories = await getFeaturedCategories();

  const categoriesWithProducts = await Promise.all(
    categories.map(async (cat) => {
      const catProducts = await getProductsByCategorySlug(cat.slug || "");
      return { ...cat, products: catProducts.slice(0, 10) };
    })
  );

  return categoriesWithProducts;
};

export const getParentCategoryData = async () => {
  const allParentCategories = await getAllParentCategories();

  return allParentCategories;
};
