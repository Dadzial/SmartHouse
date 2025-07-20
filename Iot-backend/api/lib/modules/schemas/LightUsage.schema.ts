import { Schema, model } from "mongoose";
import { LightUsageModel } from "../models/LightUsage.model";

export const LightUsageSchema = new Schema<LightUsageModel>({
    room: { type: String, required: true, unique: true },
    totalUsageMs: { type: Number, required: true, default: 0 },
    turnedOnAt: { type: Date, required: false }
});

export default model<LightUsageModel>("LightUsage", LightUsageSchema);