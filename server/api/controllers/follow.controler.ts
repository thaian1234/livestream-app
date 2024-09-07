import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { FollowValidation } from "../lib/validations/schema.validation";
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
            .post("/:followerId/:followingId", ...this.followToggle());
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
                const { offset, limit } = c.req.query();
                const offsetNumber = offset ? parseInt(offset, 10) : 0;
                const limitNumber = limit ? parseInt(limit, 10) : 10;

                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const followings =
                    await this.followService.findFollowingByUserId(
                        userId,
                        offsetNumber,
                        limitNumber,
                    );
                if (!followings) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch following",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: FollowValidation.parseFollowingMany(followings),
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
                const { offset, limit } = c.req.query();
                const offsetNumber = offset ? parseInt(offset, 10) : 0;
                const limitNumber = limit ? parseInt(limit, 10) : 10;

                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const followers = await this.followService.findFollowerByUserId(
                    userId,
                    offsetNumber,
                    limitNumber,
                );
                if (!followers) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch followers",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: FollowValidation.parseFollowerMany(followers),
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
                const { offset, limit } = c.req.query();
                const offsetNumber = offset ? parseInt(offset, 10) : 0;
                const limitNumber = limit ? parseInt(limit, 10) : 10;

                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const recommends =
                    await this.followService.findRecommendedByUserId(
                        userId,
                        offsetNumber,
                        limitNumber,
                    );
                if (!recommends) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch recommend",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: FollowValidation.parseRecommendMany(recommends),
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

                return ApiResponse.WriteJSON({
                    c,
                    data: data,
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
