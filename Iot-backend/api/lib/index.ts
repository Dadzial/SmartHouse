import App from "./app";
import LightController from "./controllers/Light.Controller";
import WeatherController from "./controllers/Weather.Controller";
import UserController from "./controllers/User.Controller";
import cors from "cors";

const app = new App([]);
const io = app.getIo();

app.app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});


const controllers = [
    new UserController(),
    new WeatherController(),
    new LightController(io),
];

controllers.forEach((controller) => {
    app.app.use("/", controller.router);
});

app.listen();
