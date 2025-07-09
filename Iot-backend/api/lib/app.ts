import express from "express";
import {config} from "./config";
import Controller from "./interfaces/Controller";
import bodyParser from "body-parser";
import morgan from "morgan";

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
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

    public listen() {
        this.app.listen(config.port, () => {
            console.log("Server is running on port " + config.port);
        });
    }
}

export default App;