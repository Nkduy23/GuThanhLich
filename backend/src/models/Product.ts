import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  image: string;
  sale: number;
  is_new: boolean;
  tags: string;
  description: string;
  categorySlug: string;
  categoryId: mongoose.Types.ObjectId;
  is_active: boolean;
  defaultVariantId: mongoose.Types.ObjectId;
}

const ProductsSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  sale: { type: Number, required: true },
  is_new: { type: Boolean, required: true },
  tags: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  is_active: { type: Boolean },
  defaultVariantId: { type: Schema.Types.ObjectId, ref: "ProductVariant", default: null },
});

ProductsSchema.virtual("productSpecs", {
  ref: "ProductSpec",
  localField: "_id",
  foreignField: "productId",
});

ProductsSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

ProductsSchema.virtual("productVariants", {
  ref: "ProductVariant",
  localField: "_id",
  foreignField: "productId",
});

ProductsSchema.virtual("productHighlights", {
  ref: "ProductHighlight",
  localField: "_id",
  foreignField: "productId",
});

export default mongoose.model<IProduct>("Product", ProductsSchema);
