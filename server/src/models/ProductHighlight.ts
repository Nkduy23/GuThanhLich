import mongoose, { Schema, Document } from "mongoose";

export interface IProduct_highlight extends Document {
  productId: mongoose.Types.ObjectId;
  title: string;
  description: string;
}

const ProductsHighlightSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.model<IProduct_highlight>("product_highlights", ProductsHighlightSchema);
