import { Request, Response } from "express";
import { Product, Review } from "../models";

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().lean();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
  }
};

export const getProductDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId").lean();
    if (!product) {
      res.status(404).send("Không tìm thấy sản phẩm");
      return;
    }
    const reviews = await Review.find({ productId: product._id }).lean();
    res.json({ success: true, product, reviews });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
