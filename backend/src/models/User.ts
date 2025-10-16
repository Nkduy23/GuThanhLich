import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  googleId: { type: String };
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    phone: { type: String, required: false },
    role: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    googleId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
