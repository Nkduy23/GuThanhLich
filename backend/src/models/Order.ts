// Update models/Order.ts (add note if needed)
import mongoose, { Schema } from "mongoose";

export interface IOrder {
  userId: mongoose.Types.ObjectId;
  addressId: mongoose.Types.ObjectId;
  voucherId: mongoose.Types.ObjectId;
  paymentMethod: string;
  status: string;
  subtotal: number;
  discount: number;
  grandTotal: number;
  note?: string;
}

const CheckoutSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  addressId: { type: Schema.Types.ObjectId, ref: "UserAddress", required: true },
  voucherId: { type: Schema.Types.ObjectId, ref: "Voucher" },
  paymentMethod: { type: String, required: true, enum: ["cod", "bank", "momo"] },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
  },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0 },
  grandTotal: { type: Number, required: true, min: 0 },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Virtual populate (không lưu vào DB, chỉ truy xuất)
CheckoutSchema.virtual("orderDetails", {
  ref: "OrderDetail", // model cần populate
  localField: "_id", // khóa trong Order
  foreignField: "orderId", // khóa bên OrderDetail
});

CheckoutSchema.set("toObject", { virtuals: true });
CheckoutSchema.set("toJSON", { virtuals: true });

export default mongoose.model<IOrder>("Order", CheckoutSchema);
