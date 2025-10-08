import { Request, Response } from "express";
import * as AdminCategoryService from "../../services/admin/adminCategory.service";

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
    const newCategory = await AdminCategoryService.createCategory(req.body);
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error creating category", error });
  }
};

// UPDATE category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await AdminCategoryService.updateCategory(id, req.body);

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy danh mục để cập nhật." });
    }

    res.json({ success: true, category: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error updating category", error: err });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await AdminCategoryService.deleteCategory(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục để xóa." });
    }

    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error deleting category", error: err });
  }
};
