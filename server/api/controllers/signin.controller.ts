import { ApiResponse } from "../lib/helpers/api-response";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { HttpStatus } from "../lib/types/http.type";
import { AuthValidation } from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { ISigninService, SignInService } from "../services/signin.service";
import { zValidator } from "@hono/zod-validator";
import { setCookie } from "hono/cookie";

import { IController } from "./types.controller";

export interface ISigninController extends IController {
    setupHandlers(): Utils.MethodReturnType<SigninController, "setupHandlers">;
}
export class SigninController {
    private factory: CreateFactoryType;
    private siginService: ISigninService;
    constructor(factory: CreateFactoryType) {
        this.factory = factory;
        this.siginService = new SignInService();
    }
    setupHandlers() {
        return this.factory
            .createApp()
            .post("/sign-in", ...this.signinHandler());
    }
    private signinHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                AuthValidation.signinSchema,
                Validator.handleParseError,
            ),
            async (c) => {
                const jsonData = c.req.valid("json");
                const { session, sessionCookie } =
                    await this.siginService.singinWithEmailAndPassword(
                        jsonData.email,
                        jsonData.password,
                    );
                if (!session || !sessionCookie) {
                    return ApiResponse.WriteErrorJSON({
                        c,
                        status: HttpStatus.Unauthorized,
                        msg: "Your Email or Password is not correct",
                    });
                }
                setCookie(c, sessionCookie.name, sessionCookie.value, {
                    ...sessionCookie.attributes,
                    sameSite: "Strict",
                });
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    msg: "Sign in successfully",
                    data: null,
                });
            },
        );
    }
}
