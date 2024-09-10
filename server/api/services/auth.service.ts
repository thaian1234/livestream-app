import {
    ILuciaService,
    LuciaService,
} from "../external-services/lucia.service";
import { Utils } from "../lib/helpers/utils";
import { AuthValidation } from "../lib/validations/schema.validation";

import { IUserService } from "./user.service";

export interface IAuthService extends Utils.AutoMappedClass<AuthService> {}

export class AuthService implements IAuthService {
    luciaService: ILuciaService;
    constructor(private readonly userService: IUserService) {
        this.luciaService = new LuciaService();
    }
    public async authenticateUser(credentials: AuthValidation.Signin) {
        const existingUser = await this.userService.getUserByEmailOrUsername(
            credentials.email,
        );
        if (!existingUser || !existingUser.hashedPassword) {
            return {
                session: null,
                sessionCookie: null,
            };
        }
        const validPassword = await Utils.PasswordUtils.verifyHash(
            existingUser.hashedPassword,
            credentials.password,
        );
        if (!validPassword) {
            return {
                session: null,
                sessionCookie: null,
            };
        }
        return await this.luciaService.initiateSession(existingUser.id);
    }
    public async registerUser(credentials: AuthValidation.Signup) {
        const hashedPassword = await Utils.PasswordUtils.hashPassword(
            credentials.password,
        );
        const newUser = await this.userService.createUser({
            ...credentials,
            hashedPassword: hashedPassword,
        });
        return newUser;
    }
    public async terminateSession(sessionId: string) {
        await this.luciaService.revokeSession(sessionId);
        return this.luciaService.getSessionCookieName();
    }
    public async initiateSession(userId: string) {
        return await this.luciaService.initiateSession(userId);
    }
}
