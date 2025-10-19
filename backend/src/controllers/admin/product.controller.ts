// admin/product.controller.ts
import { Request, Response } from "express";
import * as AdminProductService from "../../services/admin/product.service";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await AdminProductService.getProducts();
    res.json({ success: true, message: "Lấy danh sách sản phẩm thành công", products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Parse JSON body for product data
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid product data" });
    }

    // Handle uploaded files: associate with variants
    const uploadedFiles: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      (req.files as Express.Multer.File[]).forEach((file) => {
        uploadedFiles.push(`/uploads/products/${file.filename}`);
      });
    }

    // Distribute uploaded images to variants (simple: append to all variants or first, but here we'll append to the last variant for demo; adjust as needed)
    // For better UX, frontend should specify which variant each file belongs to, but for now, append all to the first variant
    if (
      productData.productVariants &&
      productData.productVariants.length > 0 &&
      uploadedFiles.length > 0
    ) {
      productData.productVariants[0].images = [
        ...(productData.productVariants[0].images || []),
        ...uploadedFiles,
      ];
    }

    const product = await AdminProductService.createProduct(productData);
    res.status(201).json({ success: true, message: "Tạo sản phẩm thành công", product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    // Parse JSON body for product data
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid product data" });
    }

    // Handle uploaded files: associate with variants
    const uploadedFiles: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      (req.files as Express.Multer.File[]).forEach((file) => {
        uploadedFiles.push(`/uploads/products/${file.filename}`);
      });
    }

    // Distribute uploaded images to variants (append to first variant for demo)
    if (
      productData.productVariants &&
      productData.productVariants.length > 0 &&
      uploadedFiles.length > 0
    ) {
      productData.productVariants[0].images = [
        ...(productData.productVariants[0].images || []),
        ...uploadedFiles,
      ];
    }

    const product = await AdminProductService.updateProduct(req.params.id, productData);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Cập nhật sản phẩm thành công", product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
