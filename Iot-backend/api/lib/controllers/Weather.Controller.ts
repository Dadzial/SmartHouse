import { Router, Request, Response } from "express";
import axios from "axios";
import Controller from "../interfaces/Controller";
import { config } from "../config";

class WeatherController implements Controller {
    public path = "/weather";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/get`, this.getJsonWeatherData);
    }

    public getJsonWeatherData = async (req: Request, res: Response) => {
        try {
            const city = req.query.city?.toString() || "Warsaw";
            const data = await this.getWeather(city);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ message: "Error fetching weather data" });
        }
    };

    private async getWeather(city: string) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${config.weatherApiKey}&units=metric`;
        const response = await axios.get(url);
        return response.data;
    }
}

export default WeatherController;
