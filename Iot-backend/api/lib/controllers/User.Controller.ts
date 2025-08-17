import Controller from "../interfaces/Controller";
import { Request, Response, Router, NextFunction } from "express";
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import {auth} from "../middlewares/auth.middleware";
class UserController implements Controller {

    public path = "/api/user";
    public router = Router();
    private userService = new UserService();
    private passwordService = new PasswordService();
    private tokenService = new TokenService();

    constructor() {
        this.initializeRouters();
    }

    private initializeRouters() {
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.delete(`${this.path}/logout/:userId`,auth, this.removeHashSession);
    }

    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
        const { login, password } = request.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const isAuthorized = await this.passwordService.authorize(user._id, password);
            if (!isAuthorized) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const token = await this.tokenService.create(user);
            response.status(200).json(this.tokenService.getToken(token));
        } catch (error) {
            console.error(`Validation Error: ${(error as Error).message}`);
            return response.status(401).json({ error: "Unauthorized" });
        }
    };

    private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
        const userData = request.body;
        console.log("userData", userData);

        try {
            const user = await this.userService.createNewOrUpdate(userData);

            if (!user) {
                return response.status(400).json({ error: "Bad request" });
            }

            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password);
                await this.passwordService.createOrUpdate({
                    userId: user._id,
                    password: hashedPassword,
                });
            }

            return response.status(200).json(user);
        } catch (error: any) {
            console.error(`Validation Error: ${error.message}`);
            return response.status(400).json({ error: "Bad request", value: error.message });
        }
    };

    private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
        const { userId } = request.params;

        try {
            const result = await this.tokenService.remove(userId);
            console.log("aaa", result);
            return response.status(200).json(result);
        } catch (error: any) {
            console.error(`Validation Error: ${error.message}`);
            return response.status(401).json({ error: "Unauthorized" });
        }
    };
}

export default UserController;
