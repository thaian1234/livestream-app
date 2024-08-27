import { Utils } from "../lib/helpers/utils";

import { IUserService, UserService } from "./user.service";

export interface ISigninService {
    singinWithEmailAndPassword(
        email: string,
        password: string,
    ): Utils.MethodReturnType<SignInService, "singinWithEmailAndPassword">;
}

export class SignInService implements ISigninService {
    private userService: IUserService;
    constructor() {
        this.userService = new UserService();
    }
    public async singinWithEmailAndPassword(email: string, password: string) {
        const existingUser = await this.userService.getUserByEmail(email);
        if (!existingUser || !existingUser.hasedPassword) {
            return {
                session: null,
                sessionCookie: null,
            };
        }
        const validPassword = await Utils.PasswordUtils.verifyHash(
            existingUser.hasedPassword,
            password,
        );
        if (!validPassword) {
            return {
                session: null,
                sessionCookie: null,
            };
        }
        return await Utils.createSessionClient(existingUser.id);
    }
}
