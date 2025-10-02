import { Request, Response } from "express";
import Blog from "../../models/Blog";

export const getBlog = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().lean();
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy blog");
  }
};
