import Controller from "../interfaces/Controller";
import { Router, Request, Response } from "express";
import axios from "axios";

class SecurityController implements Controller {
    public path = "/security"
    public router = Router()

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

    }
}
export default SecurityController;

