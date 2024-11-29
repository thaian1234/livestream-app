import { QueryDTO } from "../dtos/query.dto";
import { StreamDTO } from "../dtos/stream.dto";
import { IGetStreamService } from "../external-services/getstream.service";
import { INotificationService } from "../external-services/notification.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { JWTUtils } from "../lib/helpers/jwt";
import PaginationHelper from "../lib/helpers/pagination";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IFollowRepository } from "../repositories/follow.repository";
import { IFollowService } from "../services/follow.service";
import { ISettingService } from "../services/setting.service";
import { IStreamService } from "../services/stream.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export interface IStreamController
    extends Utils.AutoMappedClass<StreamController> {}

export class StreamController implements IStreamController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly streamService: IStreamService,
        private readonly getStreamService: IGetStreamService,
        private readonly settingService: ISettingService,
        private readonly followRepository: IFollowRepository,
        private readonly notificationService: INotificationService,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/stream-token", ...this.getStreamTokenHandler())
            .patch("/", ...this.updateStreamHandler())
            .get("/", ...this.getAllStreamHandler())
            .get("/recommend", ...this.getRecommendStreams())
            .get("/following", ...this.getFollowingStreams())
            .get("/chat-token", ...this.getStreamChatTokenHandler());
    }
    private getStreamTokenHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const token = await this.handleStreamTokenGeneration(
                    currentUser.id,
                );

                return ApiResponse.WriteJSON({
                    c,
                    msg: "Get token successfully",
                    data: { token },
                    status: HttpStatus.Created,
                });
            },
        );
    }
    private async handleStreamTokenGeneration(userId: string) {
        const stream = await this.streamService.getStreamWithSetting(userId);
        if (!stream?.setting) {
            return this.getStreamService.generateUserToken(userId);
        }

        const currentStreamKey = stream.setting.streamKey;
        if (!currentStreamKey) {
            return this.getStreamService.generateUserToken(userId);
        }

        const isExpired = await JWTUtils.isTokenExpired(currentStreamKey);
        if (isExpired) {
            const newStreamKey =
                this.getStreamService.generateUserToken(userId);
            await this.settingService.upsertByStreamId(stream.id, {
                streamKey: newStreamKey,
            });
            return newStreamKey;
        }

        return currentStreamKey;
    }
    private updateStreamHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                StreamDTO.updateSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const jsonData = c.req.valid("json");
                if (!currentUser) {
                    throw new MyError.UnauthorizedError();
                }
                const updatedStream = await this.streamService.updateStream(
                    currentUser.stream.id,
                    jsonData,
                );
                if (!updatedStream) {
                    throw new MyError.BadRequestError("Stream updates fail");
                }
                if (updatedStream.isLive) {
                    const followers =
                        await this.followRepository.findFollowerByUserId(
                            currentUser.id,
                        );

                    if (followers?.length) {
                        const followersId = followers.map(
                            (follower) => follower.id,
                        );
                        await this.notificationService.createStreamStartNotification(
                            {
                                followerIds: followersId,
                                streamerId: currentUser.id,
                                streamerName: currentUser.username,
                                streamerAvatar: currentUser.imageUrl,
                            },
                        );
                    }
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: StreamDTO.parse(updatedStream),
                    status: HttpStatus.OK,
                });
            },
        );
    }

    private getAllStreamHandler() {
        const queries = z.object({
            recommendPage: QueryDTO.createQueryParam(1),
            recommendSize: QueryDTO.createQueryParam(6),
            followPage: QueryDTO.createQueryParam(1),
            followSize: QueryDTO.createQueryParam(6),
        });

        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { recommendSize, followSize, recommendPage, followPage } =
                    c.req.valid("query");
                const currentUser = c.get("user");
                const recommendOffset = (recommendPage - 1) * recommendSize;
                const followOffset = (followPage - 1) * followSize;

                const recommendsPromise = currentUser
                    ? this.streamService.getRecommendedStreamsByUserId(
                          currentUser.id,
                          recommendOffset,
                          recommendSize,
                      )
                    : this.streamService.getRecommendedStreams(
                          recommendOffset,
                          recommendSize,
                      );

                const followingsPromise = currentUser
                    ? this.streamService.getFollowingStreamsByUserId(
                          currentUser.id,
                          followOffset,
                          followSize,
                      )
                    : null;
                const [recommendStreams, followingStreams] = await Promise.all([
                    recommendsPromise,
                    followingsPromise,
                ]);

                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        recommends: PaginationHelper.getPaginationMetadata({
                            data: StreamDTO.parseStreamWithUser(
                                recommendStreams?.streams,
                            ),
                            totalRecords: recommendStreams?.totalRecords,
                            currentOffset: recommendOffset,
                            limit: recommendSize,
                        }),
                        followings: PaginationHelper.getPaginationMetadata({
                            data: StreamDTO.parseStreamWithUser(
                                followingStreams?.streams,
                            ),
                            totalRecords: followingStreams?.totalRecords,
                            currentOffset: followOffset,
                            limit: followSize,
                        }),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getRecommendStreams() {
        const queries = QueryDTO.createPaginationSchema(1, 6);
        return this.factory.createHandlers(
            zValidator("query", queries),
            async (c) => {
                const { page, size } = c.req.valid("query");
                const offset = (page - 1) * size;
                const currentUser = c.get("user");

                const recommends = currentUser
                    ? await this.streamService.getRecommendedStreamsByUserId(
                          currentUser.id,
                          offset,
                          size,
                      )
                    : await this.streamService.getRecommendedStreams(
                          offset,
                          size,
                      );
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    data: PaginationHelper.getPaginationMetadata({
                        data: StreamDTO.parseStreamWithUser(
                            recommends?.streams,
                        ),
                        currentOffset: offset,
                        limit: size,
                        totalRecords: recommends?.totalRecords,
                    }),
                });
            },
        );
    }
    private getFollowingStreams() {
        const queries = QueryDTO.createPaginationSchema(1, 3);
        return this.factory.createHandlers(
            zValidator("query", queries),
            async (c) => {
                const { page, size } = c.req.valid("query");
                const offset = (page - 1) * size;
                const currentUser = c.get("user");
                const followings = currentUser
                    ? await this.streamService.getFollowingStreamsByUserId(
                          currentUser.id,
                          offset,
                          size,
                      )
                    : null;

                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    data: PaginationHelper.getPaginationMetadata({
                        data: StreamDTO.parseStreamWithUser(
                            followings?.streams,
                        ),
                        currentOffset: offset,
                        limit: size,
                        totalRecords: followings?.totalRecords,
                    }),
                });
            },
        );
    }
    private getStreamChatTokenHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const token = this.getStreamService.generateStreamChatToken(
                    currentUser.id,
                );
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Get token successfully",
                    data: {
                        token: token,
                    },
                    status: HttpStatus.Created,
                });
            },
        );
    }
}
