import { FollowDTO } from "../dtos/follow.dto";
import { QueryDTO } from "../dtos/query.dto";
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
            .get("/following", ...this.getAllFollowingByUserIdHandler())
            .get("/follower", ...this.getAllFollwerByUserIdHandler())
            .get("/recommend", ...this.getRecommendByUserId())
            .get("/follow", ...this.getAllFollowHandler())
            .post("/:followingId", ...this.followToggle());
    }
    private getAllFollowingByUserIdHandler() {
        const queries = QueryDTO.createPaginationSchema();
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("getUser");
                const followings =
                    await this.followService.findFollowingByUserId(
                        currentUser.id,
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
        const queries = QueryDTO.createPaginationSchema();
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("getUser");
                const followers = await this.followService.findFollowerByUserId(
                    currentUser.id,
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
        const queries = QueryDTO.createPaginationSchema();
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("getUser");
                const recommends =
                    await this.followService.findRecommendedByUserId(
                        currentUser.id,
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
            followingId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { followingId } = c.req.valid("param");
                const currentUser = c.get("getUser");
                if (currentUser.id === followingId) {
                    throw new MyError.BadRequestError();
                }

                const data = await this.followService.followToggle({
                    followerId: currentUser.id,
                    followedId: followingId,
                });

                if (!data) {
                    throw new MyError.BadRequestError();
                }

                let message = "Follow user successfully";
                if (typeof data === "boolean") {
                    message = "Unfollow user successfully";
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: undefined,
                    status: HttpStatus.OK,
                    msg: message,
                });
            },
        );
    }
    private getAllFollowHandler() {
        const queries = QueryDTO.createPaginationSchema(1, 5);
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
