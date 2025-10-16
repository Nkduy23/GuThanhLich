import mongoose, { Schema, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  description: string;
}

const BrandsSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.model<IBrand>("Brand", BrandsSchema);
