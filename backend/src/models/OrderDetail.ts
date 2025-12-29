import mongoose, { Schema, Document } from "mongoose";

export interface IOrderDetail extends Document {
  orderId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const OrderDetailSchema: Schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  variantId: { type: Schema.Types.ObjectId, ref: "ProductVariant", required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit_price: { type: Number, required: true, min: 0 },
  total_price: { type: Number, required: true, min: 0 },
});

export default mongoose.model<IOrderDetail>("OrderDetail", OrderDetailSchema);
