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
  const { name, slug } = data;

  if (!name || !slug) {
    return {
      success: false,
      message: "Tên và slug là bắt buộc",
    };
  }

  const existing = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existing) {
    return {
      success: false,
      message: existing.name === name ? "Tên danh mục đã tồn tại" : "Slug đã tồn tại",
    };
  }

  const newCategory = new Category(data);
  await newCategory.save();

  return {
    success: true,
    message: "Tạo danh mục thành công",
    category: newCategory,
  };
};

export const updateCategory = async (id: string, data: any) => {
  const { name, slug } = data;

  const category = await Category.findById(id);
  if (!category) {
    return {
      success: false,
      message: "Không tìm thấy danh mục để cập nhật",
    };
  }

  if (!name || !slug) {
    return {
      success: false,
      message: "Tên và slug là bắt buộc",
    };
  }

  const existing = await Category.findOne({
    _id: { $ne: id }, // loại trừ chính nó
    $or: [{ name }, { slug }],
  });

  if (existing) {
    return {
      success: false,
      message:
        existing.name === name
          ? "Tên danh mục đã tồn tại ở danh mục khác"
          : "Slug đã tồn tại ở danh mục khác",
    };
  }

  const updated = await Category.findByIdAndUpdate(id, data, { new: true });

  return {
    success: true,
    message: "Cập nhật danh mục thành công",
    category: updated,
  };
};

export const deleteCategory = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    return {
      success: false,
      message: "Không tìm thấy danh mục để xóa",
    };
  }

  const hasProducts = await Product.exists({ categoryId: id });
  if (hasProducts) {
    return {
      success: false,
      message: "Không thể xóa danh mục vì vẫn còn sản phẩm thuộc danh mục này",
    };
  }

  const hasChildren = await Category.exists({ parentId: id });
  if (hasChildren) {
    return {
      success: false,
      message: "Không thể xóa danh mục vì vẫn còn danh mục con",
    };
  }

  await Category.findByIdAndDelete(id);

  return {
    success: true,
    message: "Xóa danh mục thành công",
  };
};
