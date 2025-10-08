import { Request, Response } from "express";
import {
  getActiveProducts,
  getProductBySlug,
  getRelatedProducts,
} from "../../services/client/product.service";

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await getActiveProducts();
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await getProductBySlug(req.params.slug);
    if (!product) {
      res.status(404).json({ success: true, message: "Không tìm thấy sản phẩm" });
      return;
    }

    const related = await getRelatedProducts(product.categorySlug, product.slug);

    res.json({ success: true, product, related });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
