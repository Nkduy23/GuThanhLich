import { Category, Product } from "../../models";

export const getCategories = async () => {
  const categories = await Category.find()
    .select("_id name slug parentSlug isFeatured parentId")
    .lean();

  // Lấy sản phẩm theo category
  const productCount = await Product.aggregate([
    { $group: { _id: "$categoryId", count: { $sum: 1 } } },
  ]);

  const countMap = Object.fromEntries(productCount.map((p) => [p._id.toString(), p.count]));

  return categories.map((cat) => ({
    ...cat,
    productCount: countMap[cat._id.toString()] || 0,
  }));
};
export const getCategoryById = async (id: string) => {
  return Category.findById(id).lean();
};
export const createCategory = async (data: any) => {
  const newCategory = new Category(data);
  await newCategory.save();
  return newCategory;
};
export const updateCategory = async (id: string, data: any) => {
  return Category.findByIdAndUpdate(id, data, {
    new: true,
  });
};
export const deleteCategory = async (id: string) => {
  return Category.findByIdAndDelete(id);
};
