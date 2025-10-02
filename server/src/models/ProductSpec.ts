import mongoose, { Schema, Document } from "mongoose";

export interface IProduct_spec extends Document {
  productId: mongoose.Types.ObjectId;
  key: string;
  value: string;
}

const ProductsSpecSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  key: { type: String, required: true },
  value: { type: String, required: true },
});

export default mongoose.model<IProduct_spec>("ProductSpec", ProductsSpecSchema);
