import { Request, Response } from "express";
import * as AdminCategoryService from "../../services/admin/category.service";

// GET all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await AdminCategoryService.getCategories();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: err });
  }
};

// GET category by ID
export const getCategoryById = async (req: Request, res: Response) => {
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

// CREATE category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await AdminCategoryService.createCategory(req.body);

    if (!result.success) {
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
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại sau",
    });
  }
};

// UPDATE category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminCategoryService.updateCategory(id, req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: result.message,
      category: result.category,
    });
  } catch (err) {
    console.error("Lỗi cập nhật danh mục:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại sau",
    });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminCategoryService.deleteCategory(id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
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
