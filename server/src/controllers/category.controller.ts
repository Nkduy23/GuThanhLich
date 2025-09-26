import { Response, Request } from "express";
import Category from "../models/Category";

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().lean();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy danh sách loại sản phẩm");
  }
};
