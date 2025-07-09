import path from "path";
import { Router, Request, Response } from "express";
import Controller from "../interfaces/Controller";
import axios from "axios";
import {Server, Socket} from "socket.io";

class LightController implements Controller {
    public path = "/light";
    public router = Router();
    public esp32LightEndPoint = "http://192.168.2.191";
    private io: Server

    constructor(io: Server) {
        this.io = io;
        this.initializeRoutes();
        this.initializeWebSocketHandler();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/status`, this.getAllLightsStatus);
        this.router.post(`${this.path}/toggle`, this.turnLight);
        this.router.post(`${this.path}/toggle/all`, this.turnAllLights);
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

        const validRooms = ["kitchen", "garage", "room", "bath"];
        if (!validRooms.includes(room) || typeof state !== "boolean") {
            return res.status(400).json({ error: "Invalid payload. Expected { room: string, state: boolean }" });
        }

        const payload: Record<string, boolean> = {
            [room]: state
        };

        try {
            const response = await axios.post(this.esp32LightEndPoint + "/led", payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            res.status(200).send(response.data);
        } catch (error) {
            res.status(500).send(error);
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
                    this.io.emit("light:statusUpdate", response.data);
                } catch (error) {
                    socket.emit("light:error", { message: "Error sending data to ESP32" });
                }
            });

            socket.on("disconnect", () => {
                console.log(`Disconnect: ${socket.id}`);
            });
        });
    }

}

export default LightController;
