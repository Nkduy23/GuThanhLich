import { Request, Response } from "express";
import * as AdminProductService from "../../services/admin/product.service";

// Lấy tất cả sản phẩm (có thể thêm filter sau này)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await AdminProductService.getProducts();
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết 1 sản phẩm
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await AdminProductService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo mới sản phẩm
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await AdminProductService.createProduct(req.body);
    res.status(201).json({ success: true, message: "Tạo sản phẩm thành công", product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const product = await AdminProductService.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Cập nhật sản phẩm thành công", product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await AdminProductService.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Xóa sản phẩm thành công" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
