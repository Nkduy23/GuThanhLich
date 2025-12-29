import { Request, Response } from "express";
import User from "../../models/User";
import UserAddress from "../../models/UserAddress";
import jwt from "jsonwebtoken";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).lean();
    const addresses = await UserAddress.find({ userId }).lean();

    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ success: true, user, addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
