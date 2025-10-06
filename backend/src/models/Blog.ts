import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  thumbnail: string;
  slug: string;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  thumbnail: { type: String, required: true },
  slug: { type: String, required: true },
});

export default mongoose.model<IBlog>("Blog", BlogSchema);
