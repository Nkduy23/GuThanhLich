import mongoose, { Schema, Document, model } from "mongoose";

export interface IDashboard extends Document {}

const DashboardSchema: Schema = new Schema();
export default mongoose.model<IDashboard>("dashboards", DashboardSchema);
