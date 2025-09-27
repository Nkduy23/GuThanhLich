import mongoose, { Schema, Document } from "mongoose";

export interface IProductVariantImage extends Document {
  variantId: mongoose.Types.ObjectId; // tham chiếu đến ProductVariant
  images: string[];
}

const ProductVariantImageSchema: Schema = new Schema(
  {
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    images: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model<IProductVariantImage>("product_variant_images", ProductVariantImageSchema);
