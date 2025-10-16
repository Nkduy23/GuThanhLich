export interface IUser {
  fullName: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRegisterUser {
  fullName: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
}

export interface ILoginUser {
  userName: string;
  password: string;
}

export interface IUserUpdate {
  fullName?: string;
  userName?: string;
  phone?: string;
}
