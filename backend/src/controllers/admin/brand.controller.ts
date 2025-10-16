import { Request, Response } from "express";
import * as AdminBrandService from "../../services/admin/brand.service";

// GET all categories
export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await AdminBrandService.getBrands();
    res.json({ success: true, brands });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching brands", error: err });
  }
};
