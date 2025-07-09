import App from "./app";
import LightController from "./controllers/Light.Controller";

const app = new App([
    new LightController(),
]);

app.listen();