import { Request, Response } from "express";
import Category from "../../models/Category";

// GET all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().lean();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
};

// CREATE category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: "Error creating category", error: error });
  }
};

// UPDATE category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating category", error: err });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting category", error: err });
  }
};
