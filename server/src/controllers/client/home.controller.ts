import { Response, Request } from "express";
import Category from "../../models/Category";
import Product from "../../models/Product";

export const renderHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isFeatured: true })
      .select("name title description slug image")
      .populate({
        path: "products",
        select: "name slug tags price image sale defaultVariantId",
        populate: {
          path: "defaultVariantId",
          select: "color colorNameVi images",
        },
      })
      .lean();

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy dữ liệu trang Home");
  }
};
