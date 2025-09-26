import mongoose, { Schema, Document } from "mongoose";

export interface IUserAddress extends Document {
  userId: mongoose.Types.ObjectId;
  address: string;
  city: string;
  country: string;
}

const UserAddressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
});

export default mongoose.model<IUserAddress>("User_Address", UserAddressSchema);
