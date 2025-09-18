import { Response, Request } from "express";
import Product from "../models/Product";

export const renderHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().lean();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
  }
};
