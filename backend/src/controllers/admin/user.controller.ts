import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import {
  adminCreateUser,
  getAllUsers,
  adminUpdateUser,
  deleteUser,
} from "../../services/auth.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await adminCreateUser(req.body);
    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: "Tạo người dùng thành công", result });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      // Lỗi có kiểm soát
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // Lỗi không kiểm soát → lỗi hệ thống
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await getAllUsers();

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      // Lỗi có kiểm soát
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // Lỗi không kiểm soát → lỗi hệ thống
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await adminUpdateUser(id, req.body);
    res.status(200).json({ success: true, message: "Cập nhật thành công", updated });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      // Lỗi có kiểm soát
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // Lỗi không kiểm soát → lỗi hệ thống
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteUser(id);
    res.json({ success: true, message: "Xóa thành công", deleted });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      // Lỗi có kiểm soát
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // Lỗi không kiểm soát → lỗi hệ thống
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};
