import express from "express";
import {config} from "./config";
import Controller from "./interfaces/Controller";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import {Server, Socket} from "socket.io";

class App {
    public app: express.Application;
    private server: http.Server;
    public io!: Server;


    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.server = http.createServer(this.app);
        this.initializeSocket();
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private initializeMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));
    }

    private initializeSocket(): void {
        this.io = new Server(this.server, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
                allowedHeaders: ["Authorization"],
                credentials: true
            },
        });


        this.io.on("connection", (socket: Socket) => {
            console.log(`Nowe połączenie: ${socket.id}`);


            socket.on("message", (data: string) => {
                console.log(`Wiadomość od ${socket.id}: ${data}`);
                this.io.emit("message", data);
            });


            socket.on("disconnect", () => {
                console.log(`Rozłączono: ${socket.id}`);
            });
        });


        this.server.listen(config.socketPort, () => {
            console.log(`WebSocket listening on port ${config.socketPort}`);
        });
    }


    public getIo(): Server {
        return this.io;
    }



    public listen() {
        this.app.listen(config.port, () => {
            console.log("Server is running on port " + config.port);
        });
    }
}

export default App;