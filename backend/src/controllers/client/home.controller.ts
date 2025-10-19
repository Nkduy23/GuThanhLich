import { Response, Request } from "express";
import { getParentCategories } from "../../services/client/category.service";
import { getCategoryProducts } from "../../services/client/product.service";
import { getBlogs } from "../../services/client/blog.service";

export const getHomeData = async (req: Request, res: Response): Promise<void> => {
  try {
    const [categoryProducts, parentCategories, blogs] = await Promise.all([
      getCategoryProducts(),
      getParentCategories(),
      getBlogs(),
    ]);
    res.json({
      success: true,
      message: "Fetched home data successfully",
      data: { parentCategories, categoryProducts, blogs },
    });
  } catch (error) {
    console.error("Error index renderHome:", error);
    res.status(500).send("Lỗi khi lấy dữ liệu trang Home");
  }
};
