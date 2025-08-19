import {Schema, model} from "mongoose";
import {ITemperature} from "../models/temperature.model";

export const TemperatureSchema = new Schema<ITemperature>({
    temperature: { type: Number, required: true },
    city: { type: String, required: true },
    timestamp: { type: Number, required: true }
});

export default model<ITemperature>("Temperature", TemperatureSchema);