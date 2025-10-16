import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import User from "../models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { AppError } from "../utils/AppError";

import { IUser, IRegisterUser, ILoginUser, IUserUpdate } from "../interfaces/auth.interface";

import { hashPassword, comparePassword } from "../utils/auth";

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
};

export const checkUserExists = async (email: string, userName: string) => {
  const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
  if (existingUser) {
    return { exists: true, field: existingUser.email === email ? "email" : "userName" };
  }
  return { exists: false };
};

export const registerUser = async (data: IRegisterUser) => {
  const exists = await checkUserExists(data.email, data.userName);
  if (exists.exists) {
    throw new Error(`${exists.field === "email" ? "Email" : "Tên tài khoản"} đã tồn tại`);
  }

  const hashedPassword = await hashPassword(data.password);
  const user = new User({ ...data, password: hashedPassword, role: "user" });
  await user.save();
  return user;
};

export const loginUser = async (data: ILoginUser): Promise<HydratedDocument<IUser>> => {
  const { userName, password } = data;

  const user = (await User.findOne({ userName })) as HydratedDocument<IUser>;
  if (!user) throw new Error("Người dùng không tồn tại");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Mật khẩu hoặc tài khoản không chính xác");

  return user;
};

export const updateUser = async (userId: string, data: IUserUpdate) => {
  const allowedFields = ["fullName", "userName", "phone"];
  const invalidFields = Object.keys(data).filter((key) => !allowedFields.includes(key));

  if (invalidFields.length > 0) {
    throw new Error(`Không thể cập nhật các trường: ${invalidFields.join(", ")}`);
  }

  const { fullName, userName, phone } = data;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { fullName, userName, phone },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("Không tìm thấy người dùng");
  }

  return updatedUser;
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

// Config transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // e.g., your-email@gmail.com
    pass: process.env.EMAIL_PASS, // App password (không phải password thường)
  },
});

// Generate reset token
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Save token to user
export const saveResetToken = async (userId: string, token: string) => {
  const expire = Date.now() + 10 * 60 * 1000; // 10 phút
  await User.findByIdAndUpdate(userId, {
    resetPasswordToken: token,
    resetPasswordExpire: expire,
  });
};

// Send reset email
export const sendResetEmail = async (
  email: string,
  token: string,
  baseUrl: string = "http://localhost:5173"
) => {
  const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${email}`;

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔒 Yêu cầu đặt lại mật khẩu của bạn",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #f9fafb;
        padding: 30px;
        text-align: center;
      ">
        <div style="
          max-width: 500px;
          background-color: #ffffff;
          margin: 0 auto;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        ">
          <h2 style="color: #111827;">Đặt lại mật khẩu</h2>
          <p style="color: #374151; font-size: 15px;">
            Xin chào, chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
          </p>
          <p style="color: #374151; font-size: 15px;">
            Nhấn vào nút bên dưới để tiếp tục quá trình:
          </p>
          <a href="${resetUrl}" style="
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          ">
            Đặt lại mật khẩu
          </a>
          <p style="color: #6b7280; font-size: 13px; margin-top: 25px;">
            Liên kết này sẽ hết hạn sau <b>10 phút</b>.<br>
            Nếu bạn không yêu cầu, vui lòng bỏ qua email này.
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
          © ${new Date().getFullYear()} Your App. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Reset password logic
export const resetPasswordLogic = async (token: string, email: string, newPassword: string) => {
  const user = await User.findOne({
    email,
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return { success: false, message: "Token không hợp lệ hoặc đã expire" };
  }

  // Validate new password (tái sử dụng regex từ register)
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
  if (!passwordRegex.test(newPassword)) {
    return {
      success: false,
      message: "Mật khẩu mới phải ít nhất 6 ký tự, bao gồm số và ký tự đặc biệt",
    };
  }

  // Hash và update
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return { success: true, message: "Reset mật khẩu thành công! Vui lòng đăng nhập lại." };
};

// admin
export const adminCreateUser = async (data: Partial<IUser>) => {
  const exists = await checkUserExists(data.email, data.userName);
  if (exists.exists) {
    throw new AppError(`${exists.field === "email" ? "Email" : "Tên tài khoản"} đã tồn tại`, 400);
  }
  if (data.password) data.password = await hashPassword(data.password);
  const user = await User.create(data);
  return user;
};

export const getAllUsers = async () => {
  const users = await User.find().select("-password").lean();

  if (!users.length) {
    return { success: true, message: "Không có người dùng nào trong hệ thống", users: [] };
  }

  return { success: true, message: "Lấy danh sách người dùng thành công", users };
};

export const adminUpdateUser = async (targetUserId: string, data: Partial<IUser>) => {
  if (data.password) data.password = await hashPassword(data.password);
  const updated = await User.findByIdAndUpdate(targetUserId, data, { new: true });
  if (!updated) throw new AppError("Không tìm thấy người dùng", 404);
  return updated;
};

export const deleteUser = async (userId: string) => {
  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) throw new AppError("Không tìm thấy người dùng", 404);
  return deleted;
};
