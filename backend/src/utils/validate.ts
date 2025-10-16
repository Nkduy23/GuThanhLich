import { IUser, IRegisterUser, ILoginUser, IUserUpdate } from "../interfaces/auth.interface";

export const validateRegisterInput = (data: any, isAdmin = false) => {
  const { fullName, userName, email, phone, password, confirmPassword, role } = data;

  // 1. Kiểm tra trống (tùy mode)
  if (!fullName || !userName || !email || !phone || !password) {
    return { valid: false, message: "Vui lòng nhập đầy đủ thông tin" };
  }

  // 2. Full name
  if (fullName.trim().length < 4) {
    return { valid: false, message: "Họ và tên phải có ít nhất 4 ký tự" };
  }

  // 3. Username: ít nhất 4 ký tự, không dấu, chỉ gồm chữ và số
  const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;
  if (!usernameRegex.test(userName)) {
    return { valid: false, message: "Tên đăng nhập không hợp lệ" };
  }

  // 4. Email hợp lệ
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Email không hợp lệ" };
  }

  // 5. Số điện thoại: chỉ số, 10–11 chữ số
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: "Số điện thoại không hợp lệ" };
  }

  // 6. Mật khẩu
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  if (!passwordRegex.test(password)) {
    return { valid: false, message: "Mật khẩu không đủ mạnh" };
  }

  // 7. Xác nhận mật khẩu (chỉ kiểm tra ở client)
  if (!isAdmin && password !== confirmPassword) {
    return { valid: false, message: "Mật khẩu xác nhận không khớp" };
  }

  // 8. Kiểm tra role (chỉ ở admin)
  if (isAdmin && role && !["user", "admin"].includes(role)) {
    return { valid: false, message: "Vai trò không hợp lệ" };
  }

  return { valid: true, message: "Hợp lệ" };
};

export const validateLoginInput = (data: ILoginUser) => {
  const { userName, password } = data;

  const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;
  if (!usernameRegex.test(userName)) {
    return {
      valid: false,
      message: "Tên đăng nhập phải có ít nhất 4 ký tự, không dấu, không khoảng trắng",
    };
  }
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    };
  }
  return { valid: true, message: "Hợp lệ" };
};

export const validateUpdateInput = (data: IUserUpdate) => {
  const { fullName, userName, phone } = data;

  if (fullName && fullName.trim().length < 4) {
    return { valid: false, message: "Họ và tên phải có ít nhất 4 ký tự" };
  }

  if (userName) {
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;
    if (!usernameRegex.test(userName)) {
      return {
        valid: false,
        message: "Tên đăng nhập phải có ít nhất 4 ký tự, không dấu, không khoảng trắng",
      };
    }
  }

  if (phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      return { valid: false, message: "Số điện thoại không hợp lệ (chỉ gồm 10–11 số)" };
    }
  }

  return { valid: true, message: "Hợp lệ" };
};

export const adminValidateUpdateInput = (data: Partial<IUser>) => {
  const allowedFields = ["fullName", "userName", "email", "phone", "role", "password"];
  const invalidFields = Object.keys(data).filter((key) => !allowedFields.includes(key));

  if (invalidFields.length > 0) {
    return { valid: false, message: `Không thể cập nhật các trường: ${invalidFields.join(", ")}` };
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { valid: false, message: "Email không hợp lệ" };
  }

  if (data.phone && !/^[0-9]{10,11}$/.test(data.phone)) {
    return { valid: false, message: "Số điện thoại không hợp lệ" };
  }

  if (data.password && data.password.length < 6) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
  }

  return { valid: true, message: "Hợp lệ" };
};

export const validateForgotPasswordInput = (data: { email: string }) => {
  const { email } = data;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Email không đúng định dạng" };
  }
  return { valid: true };
};
