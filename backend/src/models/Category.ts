import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  title?: string;
  description?: string;
  slug: string;
  image?: string;
  parentId?: Types.ObjectId | null;
  parentSlug?: string | null;
  isFeatured?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    title: String,
    description: String,
    slug: { type: String, required: true, unique: true },
    image: String,
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    parentSlug: { type: String, default: null },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
