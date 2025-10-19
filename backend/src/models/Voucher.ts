// models/Voucher.ts (Mongoose Schema)
import mongoose, { Schema, Document } from "mongoose";

export interface IVoucher extends Document {
  code: string;
  type: "fixed" | "percentage"; // fixed amount or %
  value: number; // discount value
  minTotal: number; // min order total to apply
  maxDiscountValue?: number; // max discount cap (for %)
  usageLimit: number; // total uses
  usedCount: number; // current uses
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  discountAmount?: number;
}

const VoucherSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["fixed", "percentage"], required: true },
    value: { type: Number, required: true, min: 0 },
    minTotal: { type: Number, required: true, min: 0 },
    maxDiscountValue: { type: Number, min: 0 }, // optional for %
    usageLimit: { type: Number, required: true, min: 1 },
    usedCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    discountAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IVoucher>("Voucher", VoucherSchema);
