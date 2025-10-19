import mongoose, { Schema, Document } from "mongoose";
import { IVoucher } from "./Voucher";

interface IAppliedVoucher {
  code: string;
  type: "fixed" | "percentage";
  discountAmount: number;
}

export interface ICartItem extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  size: string;
  color: string;
  image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  createdAt: Date;
  appliedVoucher?: IAppliedVoucher;
}

const cartItemSchema = new mongoose.Schema<ICartItem>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
    required: true,
  },
  color: { type: String },
  image: { type: String },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  appliedVoucher: {
    code: { type: String },
    type: { type: String, enum: ["fixed", "percentage"] },
    discountAmount: { type: Number },
  },
});

cartItemSchema.pre("save", function (next) {
  this.total_price = this.unit_price * this.quantity;
  next();
});

export default mongoose.model<ICartItem>("CartItem", cartItemSchema);
