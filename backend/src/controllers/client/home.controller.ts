import { Response, Request } from "express";
import Category from "../../models/Category";
import Product from "../../models/Product";

export const renderHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isFeatured: true }).select("name title description slug image").lean();
    const products = await Product.find({ is_active: true })
      .select("name price defaultVariantId sale slug categorySlug tags is_new")
      .populate({
        path: "defaultVariantId",
        select: "color colorNameVi images",
      })
      .lean();

    // Helper: lấy products cho 1 category slug
    const productsForSlug = (slug: string) => {
      let filtered = [];

      // Xem lại và bỏ cate với sale và news
      if (slug === "khuyen-mai") {
        // Special case: khuyến mãi -> các sp có sale > 0
        filtered = products.filter((p) => p.sale && p.sale > 0);
      } else if (slug === "new") {
        // Special case: mới -> is_new hoặc tags chứa 'new'
        filtered = products.filter((p) => p.is_new);
      } else {
        // Default: thuộc categorySlug hoặc tags chứa slug
        filtered = products.filter((p) => p.categorySlug === slug || p.tags?.includes(slug));
      }

      // Loại trùng theo _id (nếu 1 product đủ nhiều điều kiện)
      const unique = Array.from(new Map(filtered.map((p) => [String(p._id), p])).values());

      return unique;
    };

    // Gắn products vào từng category (limit 10)
    const categoriesWithProducts = categories.map((cat) => {
      const catProducts = productsForSlug(cat.slug || "");
      return {
        ...cat,
        products: catProducts.slice(0, 10),
      };
    });

    res.json({ success: true, categories: categoriesWithProducts });
  } catch (error) {
    console.error("Error in renderHome:", error);
    res.status(500).send("Lỗi khi lấy dữ liệu trang Home");
  }
};
