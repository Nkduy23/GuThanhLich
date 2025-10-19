import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  findUserByEmail,
  generateToken,
  verifyToken,
  generateResetToken,
  saveResetToken,
  sendResetEmail,
  resetPasswordLogic,
  updateUser,
} from "../../services/auth.service";

export const me = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Vui lòng đăng nhập trước" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc hết hạn" });
    }
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: "Token không hợp lệ hoặc hết hạn" });
  }
};

export const register = async (req: Request, res: Response) => {
  const { fullName, userName, email, phone, password } = req.body;

  try {
    const result = await registerUser({ fullName, userName, email, phone, password });
    return res.status(201).json({ success: true, message: "Đăng ký thành công", result });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi đăng nhập",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);

    const token = generateToken(result._id.toString(), result.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1h,
      path: "/", // 🔒 chống cookie bị giới hạn route
    });

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: { role: result.role },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi đăng nhập",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;

    const result = await updateUser(userId, req.body);

    return res.json({ success: true, message: "Cập nhật thành công", result });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi đăng nhập",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ success: true, message: "Đăng xuất thành công" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      // Không leak info, vẫn return success để tránh enum attack
      return res.json({
        success: true,
        message: "Nếu email tồn tại, link reset đã được gửi. Kiểm tra inbox/spam.",
      });
    }

    const token = generateResetToken();
    await saveResetToken(user._id.toString(), token);
    await sendResetEmail(email, token, process.env.BASE_URL || "http://localhost:5174");

    return res.json({
      success: true,
      message: "Link reset mật khẩu đã được gửi đến email của bạn. Kiểm tra inbox/spam.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server, vui lòng thử lại sau" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, email, password, confirmPassword } = req.body;

  if (!token || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Mật khẩu không khớp nhau" });
  }

  try {
    const result = await resetPasswordLogic(token, email, password);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.json({ success: true, message: result.message });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server, vui lòng thử lại sau" });
  }
};
