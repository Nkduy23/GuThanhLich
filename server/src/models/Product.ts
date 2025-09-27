import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  image: string;
  sale: number;
  description: string;
  categorySlug: string;
  categoryId: mongoose.Types.ObjectId;
  is_active: boolean;
}

const ProductsSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  sale: { type: Number, required: true },
  description: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  is_active: { type: Boolean },
});

export default mongoose.model<IProduct>("Product", ProductsSchema);
