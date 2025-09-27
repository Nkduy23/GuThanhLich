import { Request, Response } from "express";
import User from "../../models/User";
import UserAddress from "../../models/UserAddress";
import jwt from "jsonwebtoken";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Không có token" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(404).json({ message: "Không có token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).lean();
    const addresses = await UserAddress.find({ userId: decoded.id }).lean();

    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ success: true, user, addresses });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
