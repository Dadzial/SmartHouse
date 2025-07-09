import App from "./app";
import LightController from "./controllers/Light.Controller";

const app = new App([]);
const io = app.getIo();

const controllers = [
    new LightController(io),
];

controllers.forEach((controller) => {
    app.app.use('/', controller.router);
});

app.listen();