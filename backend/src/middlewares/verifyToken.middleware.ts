// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // console.log("Cookies:", req.cookies);
  const token = req.cookies.token || req.cookies.Cookie_1; // chỉ nên dùng tạm khi test

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Chưa đăng nhập",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    (req as any).user = decoded; // 👈 gắn vào req để controller dùng
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc hết hạn",
    });
  }
};
