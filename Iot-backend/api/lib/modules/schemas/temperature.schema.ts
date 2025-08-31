import {Schema, model} from "mongoose";
import {ITemperature} from "../models/temperature.model";

export const TemperatureSchema = new Schema<ITemperature>({
    temperature: { type: Number, required: true },
    windDeg: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    city: { type: String, required: true },
    timestamp: { type: Number, required: true }
});

export default model<ITemperature>("Temperature", TemperatureSchema);