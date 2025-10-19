import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import * as AdminCategoryService from "../../services/admin/category.service";

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const getCategories = async (req: MulterRequest, res: Response) => {
  try {
    const categories = await AdminCategoryService.getCategories();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: err });
  }
};

export const getCategoryById = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;
    const category = await AdminCategoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục." });
    }

    res.json({ success: true, category });
  } catch (error) {
    console.error("Lỗi khi lấy category theo ID:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

export const createCategory = async (req: MulterRequest, res: Response) => {
  try {
    let data = req.body;

    if (req.file) {
      data.image = `/uploads/categories/${req.file.filename}`; // Gán path (dùng /uploads để public)
    }

    const result = await AdminCategoryService.createCategory(data);

    if (!result.success) {
      // Xóa file nếu create fail
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(201).json({
      success: true,
      message: result.message,
      category: result.category,
    });
  } catch (error: any) {
    // Xóa file nếu error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Lỗi tạo danh mục:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server, vui lòng thử lại sau",
    });
  }
};

// UPDATE category
export const updateCategory = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;
    let data = req.body;

    if (req.file) {
      data.image = `/uploads/categories/${req.file.filename}`;
    }

    const result = await AdminCategoryService.updateCategory(id, data);

    if (!result.success) {
      // Xóa file mới nếu update fail
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // Xóa file cũ nếu có file mới (tùy chọn)
    if (req.file) {
      const oldCategory = await AdminCategoryService.getCategoryById(id);
      if (oldCategory && oldCategory.image) {
        const oldPath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          oldCategory.image.replace("/uploads/categories", "uploads")
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    res.json({
      success: true,
      message: result.message,
      category: result.category,
    });
  } catch (err: any) {
    // Xóa file mới nếu error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Lỗi cập nhật danh mục:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Lỗi server, vui lòng thử lại sau",
    });
  }
};

// DELETE category (giữ nguyên, nhưng thêm xóa ảnh nếu cần)
export const deleteCategory = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;
    const category = await AdminCategoryService.getCategoryById(id); // ✅ Lấy để xóa ảnh

    const result = await AdminCategoryService.deleteCategory(id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // Xóa file ảnh khi delete category
    if (category && category.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        category.image.replace("/uploads", "uploads")
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error("Lỗi xóa danh mục:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại sau",
    });
  }
};
