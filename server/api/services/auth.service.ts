import { lucia } from "../lib/helpers/lucia.auth";
import { Utils } from "../lib/helpers/utils";
import { AuthValidation } from "../lib/validations/schema.validation";

import { IUserService, UserService } from "./user.service";

export interface IAuthService extends Utils.AutoMappedClass<AuthService> {}

export class AuthService implements IAuthService {
    private userService: IUserService;
    constructor() {
        this.userService = new UserService();
    }
    public async authenticateUser(data: AuthValidation.Signin) {
        const existingUser = await this.userService.getUserByEmail(data.email);
        if (!existingUser || !existingUser.hashedPassword) {
            return {
                session: null,
                sessionCookie: null,
            };
        }
        const validPassword = await this.validatePassword(
            existingUser.hashedPassword,
            data.password,
        );
        if (!validPassword) {
            return {
                session: null,
                sessionCookie: null,
            };
        }
        return await this.initiateSession(existingUser.id);
    }
    public async registerUser(data: AuthValidation.Signup) {
        const hashedPassword = await Utils.PasswordUtils.hashPassword(
            data.password,
        );
        const newUser = await this.userService.createUser({
            ...data,
            hashedPassword: hashedPassword,
        });
        if (!newUser) {
            return {
                session: null,
                sessionCookie: null,
            };
        }
        return await this.initiateSession(newUser.id);
    }
    public async terminateSession(sessionId: string) {
        await this.revokeSession(sessionId);
        return this.getSessionCookieName();
    }
    public async verifyUserExistence(email: string, username: string) {
        return !!(await this.userService.getUserByEmailOrUsername(
            email,
            username,
        ));
    }
    private async initiateSession(userId: string) {
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        return { session, sessionCookie };
    }
    private async validatePassword(hash: string, password: string) {
        return Utils.PasswordUtils.verifyHash(hash, password);
    }
    private async revokeSession(sessionId: string) {
        return lucia.invalidateSession(sessionId);
    }
    private getSessionCookieName() {
        return lucia.sessionCookieName;
    }
}
