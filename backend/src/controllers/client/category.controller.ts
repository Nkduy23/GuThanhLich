import { Response, Request } from "express";
import { getNavCategory, getCategoryBySlug } from "../../services/client/category.service";

export const renderMenus = async (req: Request, res: Response) => {
  try {
    const data = await getNavCategory();
    res.json({ success: true, categories: data });
  } catch (error) {
    console.error("Error render Categories", error);

    res.status(500).send("Lỗi khi lấy dữ liệu Category");
  }
};

export const renderCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const data = await getCategoryBySlug(slug);
    res.json({ success: true, category: data });
  } catch (error) {
    console.error("Error render Category", error);
    res.status(500).send("Lỗi khi lấy dữ liệu Category");
  }
};
