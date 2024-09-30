import { FollowDTO } from "../dtos/follow.dto";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { QueryValidation } from "../lib/validations/schema.validation";
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
            .get("/follow", ...this.getAllFollowHandler())
            .post("/:followerId/:followingId", ...this.followToggle());
    }
    private getAllFollowingByUserIdHandler() {
        const params = z.object({
            userId: z.string().uuid(),
        });
        const queries = QueryValidation.createPaginationSchema();
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator("query", queries, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { userId } = c.req.valid("param");
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("getUser");

                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const followings =
                    await this.followService.findFollowingByUserId(
                        userId,
                        (page - 1) * size,
                        size,
                    );
                if (!followings) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch following",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        followings: FollowDTO.parseUserOnlyMany(followings),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getAllFollwerByUserIdHandler() {
        const params = z.object({
            userId: z.string().uuid(),
        });
        const queries = QueryValidation.createPaginationSchema();
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator("query", queries, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { userId } = c.req.valid("param");
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("getUser");

                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const followers = await this.followService.findFollowerByUserId(
                    userId,
                    (page - 1) * size,
                    size,
                );
                if (!followers) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch followers",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        followers: FollowDTO.parseUserOnlyMany(followers),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getRecommendByUserId() {
        const params = z.object({
            userId: z.string().uuid(),
        });
        const queries = QueryValidation.createPaginationSchema();
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator("query", queries, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { userId } = c.req.valid("param");
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("getUser");

                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const recommends =
                    await this.followService.findRecommendedByUserId(
                        userId,
                        (page - 1) * size,
                        size,
                    );
                if (!recommends) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch recommend",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        recommends: FollowDTO.parseUserOnlyMany(recommends),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private followToggle() {
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
                if (currentUser.id === followingId) {
                    throw new MyError.BadRequestError();
                }

                const data = await this.followService.followToggle({
                    followerId,
                    followedId: followingId,
                });

                if (!data) {
                    throw new MyError.BadRequestError();
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: data,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getAllFollowHandler() {
        const queries = QueryValidation.createPaginationSchema(1, 5);
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("user");

                if (!currentUser) {
                    const recommends = await this.followService.findRecommended(
                        (page - 1) * size,
                        size,
                    );
                    return ApiResponse.WriteJSON({
                        c,
                        data: {
                            recommends: FollowDTO.parseUserOnlyMany(recommends),
                            followings: FollowDTO.parseUserOnlyMany(null),
                            followers: FollowDTO.parseUserOnlyMany(null),
                        },
                        status: HttpStatus.OK,
                    });
                }
                const recommends =
                    await this.followService.findRecommendedByUserId(
                        currentUser.id,
                        (page - 1) * size,
                        size,
                    );
                const followings =
                    await this.followService.findFollowingByUserId(
                        currentUser.id,
                        (page - 1) * size,
                        size,
                    );
                const followers = await this.followService.findFollowerByUserId(
                    currentUser.id,
                    (page - 1) * size,
                    size,
                );
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        recommends: FollowDTO.parseUserOnlyMany(recommends),
                        followings: FollowDTO.parseUserOnlyMany(followings),
                        followers: FollowDTO.parseUserOnlyMany(followers),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
