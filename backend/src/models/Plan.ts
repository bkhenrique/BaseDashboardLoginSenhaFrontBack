import { Schema, model, Document } from "mongoose";

export interface IPlan extends Document {
  name: string;
  description: string;
  socialCount: number;
  priceMonthly: number;
  priceAnnual: number;
}

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    description: { type: String },
    socialCount: { type: Number, required: true },
    priceMonthly: { type: Number, required: true },
    priceAnnual: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<IPlan>("Plan", PlanSchema);
