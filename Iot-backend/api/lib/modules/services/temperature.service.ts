import TemperatureSchema from "../schemas/temperature.schema";
import {ITemperature} from "../models/temperature.model";
import axios from "axios";
import { config } from "../../config";

class TemperatureService {
    public async createTemperatureData(dataParams :ITemperature) {
        try {
            const temperatureData = new TemperatureSchema(dataParams);
            await temperatureData.save();
            return temperatureData;
        } catch (error) {
            console.error('Error creating data:', error);
            throw new Error('Error creating data');
        }
    }
    public async get7DayForecast(city: string) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${config.weatherApiKey}&units=metric`;
        const response = await axios.get(url);
        return response.data;
    }

}
export default TemperatureService;
