import { BlockDTO } from "../dtos/block.dto";
import { FollowDTO } from "../dtos/follow.dto";
import { SettingDTO } from "../dtos/setting.dto";
import { StreamDTO } from "../dtos/stream.dto";
import { UserDTO } from "../dtos/user.dto";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { BlockUtils } from "../lib/helpers/block-util";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IBlockService } from "../services/block.service";
import { IFollowService } from "../services/follow.service";
import { ISettingService } from "../services/setting.service";
import { IStreamService } from "../services/stream.service";
import { IUserService } from "../services/user.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export interface IUserController
    extends Utils.PickMethods<UserController, "setupHandlers"> {}

export class UserController {
    constructor(
        private factory: CreateFactoryType,
        private userService: IUserService,
        private followService: IFollowService,
        private streamService: IStreamService,
        private blockSerice: IBlockService,
        private settingService: ISettingService,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/", ...this.getAllUserHandler())
            .get("/:username", ...this.getUserByUsername())
            .patch("/", ...this.updateUserHandler())
            .patch("/update-password", ...this.changeUserPasswordHandler());
    }
    private updateUserHandler() {
        const respSchema = UserDTO.selectSchema;
        return this.factory.createHandlers(
            zValidator(
                "json",
                UserDTO.updateSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");

                const updatedUser = await this.userService.updateUser(
                    currentUser.id,
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
        const respData = UserDTO.selectSchema.array();
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
        return this.factory.createHandlers(
            zValidator(
                "json",
                UserDTO.updatePasswordSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");
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
                    currentUser.id,
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
    private getUserByUsername() {
        const params = z.object({
            username: z.string().trim().min(1),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const { username } = c.req.valid("param");
                const user = await this.userService.findByUsername(username);
                const currentUser = c.get("user");

                if (!user) {
                    throw new MyError.NotFoundError("User not found");
                }

                currentUser &&
                    (await BlockUtils.checkUserBlock(currentUser.id, user.id));

                const [stream, followers] = await Promise.all([
                    this.streamService.getStreamByUserId(user.id),
                    this.followService.findFollowerByUserId(user.id),
                ]);

                const isCurrentUserDifferent =
                    currentUser && currentUser.id !== user.id;

                const responseData = {
                    user: UserDTO.parse(user),
                    stream: StreamDTO.parse(stream),
                    followers: FollowDTO.parseUserOnlyMany(followers),
                    isFollowing: false,
                    isBlocked: false,
                };
                const setting = SettingDTO.parse(
                    await this.settingService.getSettingByStreamId(
                        responseData.stream.id,
                    ),
                );

                if (isCurrentUserDifferent) {
                    responseData.isFollowing = !!followers?.find(
                        (follower) => follower.id === currentUser.id,
                    );
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: { ...responseData, setting },
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
