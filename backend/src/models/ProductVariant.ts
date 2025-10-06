import mongoose, { Schema, Document } from "mongoose";

export interface ISize {
  size: string;
  quantity: number;
}

export interface IProductVariant extends Document {
  productId: mongoose.Types.ObjectId;
  color: string;
  colorNameVi: string;
  sizes: ISize[];
  images: string[];
  is_active: boolean;
}

const ProductVariantSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: String, required: true },
    colorNameVi: { type: String, required: true },
    sizes: [
      {
        size: { type: String, required: true },
        quantity: { type: Number, default: 0 },
      },
    ],
    images: [{ type: String }],
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProductVariant>("ProductVariant", ProductVariantSchema);
