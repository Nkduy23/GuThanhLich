import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  user: string;
  rate: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: String, required: true },
  rate: { type: Number, required: true },
  comment: { type: String, required: true },
});

export default mongoose.model<IReview>("Review", ReviewSchema);
