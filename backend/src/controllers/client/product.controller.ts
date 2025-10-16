import { Request, Response } from "express";
import {
  getActiveProducts,
  getProductBySlug,
  getProductById as getProductByIdService,
  getProductByIdServiceTest,
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
      res.status(404).json({ success: true, message: "No product found" });
      return;
    }

    const related = await getRelatedProducts(product.categorySlug, product.slug);

    res.json({ success: true, message: "Get product detail successfully", product, related });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);

    if (!product) {
      res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
      return;
    }

    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBatchTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      res.status(400).json({ success: false, message: "Invalid product IDs" });
      return;
    }

    const products = await getProductByIdServiceTest(productIds);
    res.json({ success: true, products });
  } catch (error: any) {
    console.error("Batch fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
