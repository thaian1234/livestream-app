import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { UserValidation } from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IUserService } from "../services/user.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export interface IUserController
    extends Utils.PickMethods<UserController, "setupHandlers"> {}

export class UserController {
    constructor(
        private factory: CreateFactoryType,
        private userService: IUserService,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/", ...this.getAllUserHandler())
            .patch("/:id", ...this.updateUserHandler())
            .patch("/:id/update-password", ...this.changeUserPasswordHandler());
    }
    private updateUserHandler() {
        const params = z.object({
            id: z.string().uuid(),
        });
        const respSchema = UserValidation.selectSchema;
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
                    throw new MyError.UnauthorizedError(
                        "Username already exist",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.parse(updatedUser),
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getAllUserHandler() {
        const respData = UserValidation.selectSchema.array();
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const users = await this.userService.getAllUser();
                if (!users) {
                    throw new MyError.BadRequestError("Failed to fetch user");
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        users: respData.parse(users),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private changeUserPasswordHandler() {
        const params = z.object({
            id: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator(
                "json",
                UserValidation.updatePasswordSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const { id } = c.req.valid("param");
                const currentUser = c.get("getUser");
                if (id !== currentUser.id) {
                    throw new MyError.UnauthorizedError();
                }
                const isMatchedPassword =
                    await this.userService.isMatchedPassword(
                        currentUser.id,
                        jsonData.currentPassword,
                    );
                if (!isMatchedPassword) {
                    throw new MyError.UnauthorizedError(
                        "Your current password is not match, please try again!",
                    );
                }
                const updatedUser = await this.userService.updatePassword(
                    id,
                    jsonData.newPassword,
                );
                if (!updatedUser) {
                    throw new MyError.ServiceUnavailableError(
                        "Cannot update your Password",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: undefined,
                    status: HttpStatus.OK,
                    msg: "Password updated successfully",
                });
            },
        );
    }
}
