import { lucia } from "../lib/helpers/lucia.auth";
import { Utils } from "../lib/helpers/utils";
import { AuthValidation } from "../lib/validations/schema.validation";

import { IUserService, UserService } from "./user.service";

export interface ISignupService {
    signupWithPassword(
        data: AuthValidation.Signup,
    ): Utils.MethodReturnType<SignupService, "signupWithPassword">;
    checkExistingUser(
        email: string,
        username: string,
    ): Utils.MethodReturnType<SignupService, "checkExistingUser">;
}

export class SignupService {
    private userService: IUserService;
    constructor() {
        this.userService = new UserService();
    }
    public async signupWithPassword(data: AuthValidation.Signup) {
        const hasedPassword = await Utils.PasswordUtils.hashPassword(
            data.password,
        );
        const newUser = await this.userService.createUser({
            ...data,
            hasedPassword: hasedPassword,
        });
        if (!newUser) {
            return {
                session: null,
                sessionCookie: null,
            };
        }
        const session = await lucia.createSession(newUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        return {
            session,
            sessionCookie,
        };
    }
    public async checkExistingUser(email: string, username: string) {
        return !!(await this.userService.getUserByEmailOrUsername(
            email,
            username,
        ));
    }
}
