// src/constants/httpStatus.ts

export const HTTP_STATUS = {
  // ✅ Thành công
  OK: 200, // Yêu cầu thành công (GET, PUT, DELETE)
  CREATED: 201, // Tạo tài nguyên mới thành công (POST)
  NO_CONTENT: 204, // Thành công nhưng không có dữ liệu trả về (DELETE)

  // ⚠️ Lỗi từ phía client
  BAD_REQUEST: 400, // Dữ liệu gửi lên không hợp lệ
  UNAUTHORIZED: 401, // Chưa đăng nhập hoặc token sai
  FORBIDDEN: 403, // Không có quyền truy cập
  NOT_FOUND: 404, // Không tìm thấy tài nguyên
  CONFLICT: 409, // Dữ liệu bị trùng (VD: email đã tồn tại)
  UNPROCESSABLE_ENTITY: 422, // Dữ liệu hợp lệ cú pháp nhưng logic sai (ít dùng hơn 400)

  // 💥 Lỗi từ phía server
  INTERNAL_SERVER_ERROR: 500, // Lỗi hệ thống nội bộ
  SERVICE_UNAVAILABLE: 503, // Server tạm ngừng hoặc quá tải
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
