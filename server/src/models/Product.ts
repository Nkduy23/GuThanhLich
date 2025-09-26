import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
}

const ProductsSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

export default mongoose.model<IProduct>("Product", ProductsSchema);
