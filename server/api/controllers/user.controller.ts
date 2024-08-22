import { ApiResponse } from "../lib/helpers/api-response";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { HttpStatus } from "../lib/types/http.type";
import { UserValidation } from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { IUserService, UserService } from "../services/user.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { IController } from "./types.controller";

export interface IUserController extends IController {
    setupHandlers(): Utils.MethodReturnType<UserController, "setupHandlers">;
}

export class UserController {
    private factory: CreateFactoryType;
    private userService: IUserService;
    constructor(factory: CreateFactoryType) {
        this.factory = factory;
        this.userService = new UserService();
    }
    setupHandlers() {
        return this.factory
            .createApp()
            .patch("/:id", ...this.updateUserHandler());
    }
    private updateUserHandler() {
        const params = z.object({
            id: z.string().uuid(),
        });
        const response = UserValidation.selectSchema.omit({
            hasedPassword: true,
        });
        return this.factory.createHandlers(
            zValidator(
                "json",
                UserValidation.updateSchema,
                Validator.handleParseError,
            ),
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const jsonData = c.req.valid("json");
                const { id } = c.req.valid("param");
                const updatedUser = await this.userService.updateUser(
                    id,
                    jsonData,
                );
                const resp = response.safeParse(updatedUser);
                if (!resp.success) {
                    return ApiResponse.WriteJSON({
                        c,
                        msg: "Failed to parse",
                        status: HttpStatus.BadGateway,
                    });
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: resp.data,
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
