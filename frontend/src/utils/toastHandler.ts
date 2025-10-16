// src/utils/toastHandler.ts
import { toast } from "react-toastify";

/**
 * Hiển thị thông báo toast dựa trên phản hồi từ BE
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showToast = (res: Response, data: any) => {
  if (res.ok) {
    toast.success(data.message || "Thành công 🎉");
  } else {
    toast.error(data.message || "Đã xảy ra lỗi ❌");
  }
};

/**
 * Hiển thị lỗi mạng (server không phản hồi)
 */
export const showNetworkError = () => {
  toast.error("Không thể kết nối đến server ⚠️");
};
