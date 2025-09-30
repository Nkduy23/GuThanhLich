import { Response, Request } from "express";
import Category from "../../models/Category";

export const renderHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isFeatured: true })
      .select("name title description slug image")
      .populate({
        path: "products", // virtual field
        select: "name slug price image sale",
      })
      .lean();

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy dữ liệu trang Home");
  }
};
