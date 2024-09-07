import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IFollowService } from "../services/follow.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export interface IFollowController
    extends Utils.PickMethods<FollowController, "setupHandlers"> {}

export class FollowController implements IFollowController {
    constructor(
        private factory: CreateFactoryType,
        private followService: IFollowService,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/:userId/following", ...this.getAllFollowingByUserIdHandler())
            .get("/:userId/follower", ...this.getAllFollwerByUserIdHandler())
            .get("/:userId/recommend", ...this.getRecommendByUserId())
            .post("/:followerId/:followingId", ...this.followUser())
            .delete("/:followerId/:followingId", ...this.unfollowUser());
    }
    private getAllFollowingByUserIdHandler() {
        const params = z.object({
            userId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { userId } = c.req.valid("param");
                const currentUser = c.get("getUser");
                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const followings =
                    await this.followService.findFollowingByUserId(userId);
                if (!followings) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch following",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: followings,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getAllFollwerByUserIdHandler() {
        const params = z.object({
            userId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { userId } = c.req.valid("param");
                const currentUser = c.get("getUser");
                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const followers =
                    await this.followService.findFollowerByUserId(userId);
                if (!followers) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch followers",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: followers,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getRecommendByUserId() {
        const params = z.object({
            userId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { userId } = c.req.valid("param");
                const currentUser = c.get("getUser");
                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const recommends =
                    await this.followService.findRecommendedByUserId(userId);
                if (!recommends) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch recommend",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: recommends,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private followUser() {
        const params = z.object({
            followerId: z.string().uuid(),
            followingId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { followerId, followingId } = c.req.valid("param");
                const currentUser = c.get("getUser");
                if (currentUser.id !== followerId) {
                    throw new MyError.UnauthorizedError();
                }
                const followers = await this.followService.createFollow({
                    followerId,
                    followedId: followingId,
                });
                if (!followers) {
                    throw new MyError.BadRequestError("Failed to follow user");
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: followers,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private unfollowUser() {
        const params = z.object({
            followerId: z.string().uuid(),
            followingId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { followerId, followingId } = c.req.valid("param");
                const currentUser = c.get("getUser");
                if (currentUser.id !== followerId) {
                    throw new MyError.UnauthorizedError();
                }
                const isUnfollow = await this.followService.deleteFollow({
                    followerId,
                    followedId: followingId,
                });
                if (!isUnfollow) {
                    throw new MyError.BadRequestError("Failed to unfollow");
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: isUnfollow,
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
