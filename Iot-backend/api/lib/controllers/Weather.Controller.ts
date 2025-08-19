import { Router, Request, Response } from "express";
import axios from "axios";
import Joi from "joi";
import Controller from "../interfaces/Controller";
import TemperatureService from "../modules/services/temperature.service";
import { config } from "../config";

class WeatherController implements Controller {
    public path = "/weather";
    public router = Router();
    public temperatureService = new TemperatureService();


    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/get/temp/:city`, this.getJsonTempData);
        this.router.get(`${this.path}/get/history/:city`, this.getTemperatureHistory);
    }

    public getJsonTempData = async (req: Request, res: Response) => {
        try {
            const city = req.params.city?.toString();
            if (!city) {
                return res.status(400).json({ message: "City parameter is required" });
            }

            const data = await this.getWeather(city);

            const filteredData ={
                city: data.name,
                temperature: data.main.temp,
                timestamp: Date.now()
            }

            const schema = Joi.object({
                city: Joi.string().required(),
                temperature: Joi.number().required(),
                timestamp: Joi.number().required(),
            });

            await this.temperatureService.createTemperatureData(filteredData);

            const validationResult = schema.validate(filteredData);

            if (validationResult.error) {
                return res.status(400).json({ message: validationResult.error.message });
            }

            res.status(200).json(filteredData);
        } catch (error: any) {
            res.status(500).json({ message: "Error fetching weather data" });
        }
    };

    public getTemperatureHistory = async (req: Request, res: Response) => {
        try {
            const city = req.params.city?.toString();
            if (!city) {
                return res.status(400).json({ message: "City parameter is required" });
            }

            const history = await this.temperatureService.getWeatherCityHistory(city);

            res.status(200).json(history);
        } catch (error: any) {
            res.status(500).json({ message: "Error fetching temperature history" });
        }
    };

    private async getWeather(city: string) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${config.weatherApiKey}&units=metric`;
        const response = await axios.get(url);
        return response.data;
    }
}

export default WeatherController;
