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
        this.router.get(`${this.path}/forecast/:city`, this.get7DayForecast);
        this.router.get(`${this.path}/temperature/:city`, this.getTemperature);
        this.router.get(`${this.path}/wind/:city`, this.getWind);
        this.router.get(`${this.path}/humidity/:city`, this.getHumidity);
    }

    public getTemperature = async (req: Request, res: Response) => {
        const schema = Joi.object({
            city: Joi.string().required()
        });

        const { error, value } = schema.validate(req.params);
        if (error) return res.status(400).json({ message: error.message });

        try {
            const data = await this.getWeather(value.city);
            res.status(200).json({
                city: data.name,
                temperature: data.main.temp,
                timestamp: Date.now()
            });
        } catch (err: any) {
            res.status(500).json({ message: "Error fetching temperature" });
        }
    };

    public getWind = async (req: Request, res: Response) => {
        const schema = Joi.object({
            city: Joi.string().required()
        });

        const { error, value } = schema.validate(req.params);
        if (error) return res.status(400).json({ message: error.message });

        try {
            const data = await this.getWeather(value.city);
            res.status(200).json({
                city: data.name,
                windDeg: data.wind.deg,
                windSpeed: data.wind.speed,
                timestamp: Date.now()
            });
        } catch (err: any) {
            res.status(500).json({ message: "Error fetching wind data" });
        }
    };

    public getHumidity = async (req: Request, res: Response) => {
        const schema = Joi.object({
            city: Joi.string().required()
        });

        const { error, value } = schema.validate(req.params);
        if (error) return res.status(400).json({ message: error.message });

        try {
            const data = await this.getWeather(value.city);
            res.status(200).json({
                city: data.name,
                humidity: data.main.humidity,
                timestamp: Date.now()
            });
        } catch (err: any) {
            res.status(500).json({ message: "Error fetching humidity" });
        }
    }

    public get7DayForecast = async (req: Request, res: Response) => {
        const schema = Joi.object({
            city: Joi.string().required()
        });

        const { error, value } = schema.validate(req.params);
        if (error) return res.status(400).json({ message: error.message });

        try {
            const data = await this.temperatureService.get7DayForecast(value.city);


            const daysMap: Record<string, any[]> = {};
            for (const item of data.list) {
                const date = new Date(item.dt * 1000).toISOString().split("T")[0];
                if (!daysMap[date]) daysMap[date] = [];
                daysMap[date].push(item);
            }

            const savedData = [];
            const dates = Object.keys(daysMap).slice(0, 6);

            for (const date of dates) {
                const items = daysMap[date];

                const avgTemp = items.reduce((sum, i) => sum + i.main.temp, 0) / items.length;
                const windSpeed = items.reduce((sum, i) => sum + i.wind.speed, 0) / items.length;
                const windDeg = items.reduce((sum, i) => sum + i.wind.deg, 0) / items.length;
                const { description, icon } = items[0].weather[0];

                const tempData = {
                    temperature: avgTemp,
                    windDeg,
                    windSpeed,
                    description,
                    icon,
                    city: value.city,
                    timestamp: new Date(date).getTime()
                };
                const saved = await this.temperatureService.createTemperatureData(tempData);
                savedData.push(saved);
            }

            res.status(200).json(savedData);
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ message: "Error fetching 7-day forecast" });
        }
    };

    private async getWeather(city: string) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${config.weatherApiKey}&units=metric`;
        const response = await axios.get(url);
        return response.data;
    }
}

export default WeatherController;
