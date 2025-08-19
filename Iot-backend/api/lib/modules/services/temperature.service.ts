import TemperatureSchema from "../schemas/temperature.schema";
import {ITemperature} from "../models/temperature.model";

class TemperatureService {
    public async createTemperatureData(dataParams :ITemperature) {
        try {
            const temperatureData = new TemperatureSchema(dataParams);
            await temperatureData.save();
        } catch (error) {
            console.error('Error creating data:', error);
            throw new Error('Error creating data');
        }
    }

    public async getWeatherCityHistory(city: string): Promise<ITemperature[]> {
        try {
            return await TemperatureSchema.find({ city }, { _id: 0 , __v: 0}).sort({ timestamp: -1 });
        } catch (error) {
            console.error('Error downloading data:', error);
            throw new Error('Error downloading data');
        }
    }

}
export default TemperatureService;
