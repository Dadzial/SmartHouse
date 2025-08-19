import path from "path";
import { Router, Request, Response } from "express";
import Controller from "../interfaces/Controller";
import axios from "axios";
import {Server, Socket} from "socket.io";
import cron from "node-cron";
import Joi from "joi";
import {LightUsageModel} from "../modules/models/LightUsage.model";
import lightUsageSchema from "../modules/schemas/LightUsage.schema";
import LightUsageService from "../modules/services/LightUsage.service";

class LightController implements Controller {
    public path = "/light";
    public router = Router();
    public esp32LightEndPoint = "http://192.168.2.192";
    private io: Server
    private lightUsageService = new LightUsageService();


    constructor(io: Server) {
        this.io = io;
        this.initializeRoutes();
        this.initializeWebSocketHandler();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/status`, this.getAllLightsStatus);
        this.router.post(`${this.path}/toggle`, this.turnLight);
        this.router.post(`${this.path}/toggle/all`, this.turnAllLights);
        this.router.get(`${this.path}/usage`, this.getLightUsageDurations);
        this.router.delete(`${this.path}/usage/reset`, this.resetLightUsageDurations);
    }

    private getAllLightsStatus = async (req: Request, res: Response) => {
        try {
            const response = await axios.get(this.esp32LightEndPoint + "/showlight");
            res.status(200).send(response.data);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    private turnLight = async (req: Request, res: Response) => {
        const { room, state } = req.body;

        try {
            if (typeof state !== "boolean" || !room) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid payload. Expected { room: string, state: boolean }"
                });
            }

            const payload: Record<string, boolean> = { [room]: state };
            const response = await axios.post(this.esp32LightEndPoint + "/led", payload, {
                headers: { "Content-Type": "application/json" }
            });

            await this.lightUsageService.updateLightState(room, state);

            console.log(`Light turned ${state ? "ON" : "OFF"} in ${room} at ${new Date().toISOString()}`);

            res.status(200).json({
                success: true,
                room,
                state,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error("Error controlling light:", error);
            res.status(500).json({
                success: false,
                error: "Failed to control light",
                details: error instanceof Error ? error.message : String(error)
            });
        }
    }

    private turnAllLights = async (req: Request, res: Response) => {
        const { state } = req.body;

        if (typeof state !== "boolean") {
            return res.status(400).json({ error: "Invalid payload. Expected { state: boolean }" });
        }

        const payload = {
            kitchen: state,
            garage: state,
            room: state,
            bath: state
        };

        try {
            const response = await axios.post(this.esp32LightEndPoint + "/led", payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            for (const room of Object.keys(payload)) {
                await this.lightUsageService.updateLightState(room, state);
            }

            res.status(200).send(response.data);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    private initializeWebSocketHandler() {
        this.io.on("connection", (socket: Socket) => {
            console.log(`New connection: ${socket.id}`);

            socket.on("light:getStatus",async () =>{
               try {
                   const response = await axios.get(this.esp32LightEndPoint + "/showlight");
                   socket.emit("light:getStatus", response.data);
               } catch (error) {
                   socket.emit("light:getStatus", error);
               }
            });

            socket.on("light:toggle", async (data: { room: string; state: boolean }) => {
                const validRooms = ["kitchen", "garage", "room", "bath"];
                if (!validRooms.includes(data.room)) {
                    return socket.emit("light:error", { message: "Bad payload" });
                }

                const payload: Record<string, boolean> = {
                    [data.room]: data.state
                };

                try {
                    const response = await axios.post(this.esp32LightEndPoint + "/led", payload, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    await this.lightUsageService.updateLightState(data.room, data.state);

                    this.io.emit("light:statusUpdate", response.data);
                } catch (error) {
                    socket.emit("light:error", { message: "Error sending data to ESP32" });
                }
            });

            socket.on("light:toggleAll", async (data: { state: boolean }) => {
                if (typeof data.state !== "boolean") {
                    return socket.emit("light:error", { message: "Bad payload" });
                }

                const payload = {
                    kitchen: data.state,
                    garage: data.state,
                    room: data.state,
                    bath: data.state
                };

                try {
                    const response = await axios.post(this.esp32LightEndPoint + "/led", payload, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    for (const room of Object.keys(payload)) {
                        await this.lightUsageService.updateLightState(room, data.state);
                    }

                    this.io.emit("light:statusUpdate", response.data);
                } catch (error) {
                    socket.emit("light:error", { message: "Error sending data to ESP32" });
                }
            });

            socket.on("light:schedule", (data: { rooms: string[]; days: string[]; startTime: string; endTime: string }) => {
                console.log("New schedule received:", data);

                const { rooms, days, startTime, endTime } = data;

                const dayMap: Record<string, number> = {
                    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
                };

                days.forEach(day => {
                    const cronDay = dayMap[day];
                    if (cronDay === undefined) return;

                    const [startH, startM] = startTime.split(":").map(Number);
                    const [endH, endM] = endTime.split(":").map(Number);


                    cron.schedule(`${startM} ${startH} * * ${cronDay}`, async () => {
                        for (const room of rooms) {
                            await this.toggleRoom(room, true);
                        }
                    });

                    cron.schedule(`${endM} ${endH} * * ${cronDay}`, async () => {
                        for (const room of rooms) {
                            await this.toggleRoom(room, false);
                        }
                    });
                });

                socket.emit("light:schedule:ok", { message: "Schedule saved" });
            });

            socket.on("disconnect", () => {
                console.log(`Disconnect: ${socket.id}`);
            });
        });
    }

    private async toggleRoom(room: string, state: boolean) {
        const payload: Record<string, boolean> = { [room]: state };
        const response = await axios.post(this.esp32LightEndPoint + "/led", payload, {
            headers: { "Content-Type": "application/json" }
        });

        await this.lightUsageService.updateLightState(room, state);
        this.io.emit("light:statusUpdate", response.data);
    }

    private getLightUsageDurations = async (req: Request, res: Response) => {
        try {
            const durations = await this.lightUsageService.getLightUsageDurations();
            res.status(200).json(durations);
        } catch (error) {
            res.status(500).json({ error: "Error getting light usage durations" });
        }
    };

    private resetLightUsageDurations = async (req: Request, res: Response) => {
        try {
            await this.lightUsageService.resetLightUsage();
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: "Error resetting light usage durations" });
        }
    };
}

export default LightController;
