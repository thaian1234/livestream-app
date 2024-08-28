import { ApiResponse } from "../lib/helpers/api-response";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { HttpStatus } from "../lib/types/http.type";
import { AuthValidation } from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { ISignupService, SignupService } from "../services/signup.service";
import { zValidator } from "@hono/zod-validator";
import { setCookie } from "hono/cookie";

import { IController } from "./types.controller";

export interface ISignupController extends IController {
    setupHandlers(): Utils.MethodReturnType<SignupController, "setupHandlers">;
}

export class SignupController implements ISignupController {
    private factory: CreateFactoryType;
    private signupService: ISignupService;
    constructor(factory: CreateFactoryType) {
        this.factory = factory;
        this.signupService = new SignupService();
    }
    setupHandlers() {
        return this.factory
            .createApp()
            .post("/sign-up", ...this.signupHandler());
    }
    private signupHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                AuthValidation.signupSchema,
                Validator.handleParseError,
            ),
            async (c) => {
                const jsonData = c.req.valid("json");
                const existingUser = await this.signupService.checkExistingUser(
                    jsonData.email,
                    jsonData.username,
                );
                if (existingUser) {
                    return ApiResponse.WriteErrorJSON({
                        c,
                        status: HttpStatus.BadRequest,
                        msg: "Email or Username already in use",
                    });
                }
                const { session, sessionCookie } =
                    await this.signupService.signupWithEmailAndPassword(
                        jsonData,
                    );
                if (!session || !sessionCookie) {
                    return ApiResponse.WriteErrorJSON({
                        c,
                        status: HttpStatus.Unauthorized,
                        msg: "Sign up failed",
                    });
                }
                setCookie(c, sessionCookie.name, sessionCookie.value, {
                    ...sessionCookie.attributes,
                    sameSite: "Strict",
                });
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    msg: "Sign up successfully",
                    data: undefined,
                });
            },
        );
    }
}
