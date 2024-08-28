import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { HttpStatus } from "../lib/types/http.type";
import { UserValidation } from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
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
            .get("/", ...this.getAllUserHandler())
            .patch("/:id", ...this.updateUserHandler());
    }
    private updateUserHandler() {
        const params = z.object({
            id: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator(
                "json",
                UserValidation.updateSchema,
                Validator.handleParseError,
            ),
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const { id } = c.req.valid("param");
                const currentUser = c.get("getUser");
                if (currentUser.id !== id) {
                    throw new MyError.UnauthorizedError();
                }
                const updatedUser = await this.userService.updateUser(
                    id,
                    jsonData,
                );
                if (!updatedUser) {
                    return ApiResponse.WriteErrorJSON({
                        c,
                        status: HttpStatus.NotFound,
                        msg: "User not found",
                    });
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: updatedUser,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getAllUserHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const users = await this.userService.getAllUser();
                console.log(c.get("getUser"));
                if (!users) {
                    return ApiResponse.WriteErrorJSON({
                        c,
                        status: HttpStatus.BadRequest,
                        msg: "Failed to fetch users",
                    });
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: users,
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
