import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

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

import { ICategoryService } from "../services/category.service";
import { ISettingService } from "../services/setting.service";
import { IStreamService } from "../services/stream.service";

import { AIServiceBuilder } from "../external-services/ai.service";
import { IGetStreamService } from "../external-services/getstream.service";
import { INotificationService } from "../external-services/notification.service";

import { QueryDTO } from "../dtos/query.dto";
import { StreamDTO } from "../dtos/stream.dto";
import { StreamToCategoriesDTO } from "../dtos/streamToCategories.dto";

export interface IStreamController
    extends Utils.AutoMappedClass<StreamController> {}

export class StreamController implements IStreamController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly streamService: IStreamService,
        private readonly getStreamService: IGetStreamService,
        private readonly settingService: ISettingService,
        private readonly categoryService: ICategoryService,
        private readonly followRepository: IFollowRepository,
        private readonly notificationService: INotificationService,
        private readonly aiBuilder: AIServiceBuilder,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/", ...this.getAllStreamHandler())
            .patch("/", ...this.updateStreamHandler())

            .get("/stream-token", ...this.getStreamTokenHandler())
            .get("/recommend", ...this.getRecommendStreams())
            .get("/following", ...this.getFollowingStreams())
            .get("/chat-token", ...this.getStreamChatTokenHandler())
            .get("/categories", ...this.getCategoriesHandler())
            .post("/add-categories", ...this.addCategoriesToStream())
            .post("/generate-title", ...this.generateTitleHandler())
            .delete("/remove-category", ...this.deleteCategoriesFromStream());
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
                                streamerAvatar: currentUser.imageUrl || "",
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
                const formattedData = recommends?.streams.map((stream) => {
                    const categories = stream.streamsToCategories.map(
                        (streamToCategory) => streamToCategory.category,
                    );
                    return {
                        ...stream,
                        categories,
                    };
                });
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    data: PaginationHelper.getPaginationMetadata({
                        data: StreamDTO.parseStreamWithUser(formattedData),
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
                const formattedData = followings?.streams.map((stream) => {
                    const categories = stream.streamsToCategories.map(
                        (streamToCategory) => streamToCategory.category,
                    );
                    return {
                        ...stream,
                        categories,
                    };
                });
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    data: PaginationHelper.getPaginationMetadata({
                        data: StreamDTO.parseStreamWithUser(formattedData),
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
    private addCategoriesToStream() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                StreamToCategoriesDTO.addCategoriesToStreamSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");
                if (currentUser.stream.id !== jsonData.streamId) {
                    throw new MyError.UnauthorizedError(
                        "You are not allowed to add categories to this stream",
                    );
                }
                if (!jsonData.categoryIds.length) {
                    await this.categoryService.deleteAllCategoriesFromStream(
                        jsonData.streamId,
                    );
                    return ApiResponse.WriteJSON({
                        c,
                        data: undefined,
                        status: HttpStatus.Created,
                        msg: "Bulk add category to stream success",
                    });
                }
                const isSuccess =
                    await this.categoryService.addCategoriesToStream(
                        jsonData.categoryIds.map((categoryId: string) => ({
                            categoryId: categoryId,
                            streamId: jsonData.streamId,
                        })),
                    );
                if (!isSuccess) {
                    throw new MyError.BadRequestError(
                        "Failed to bulk add category to stream",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: undefined,
                    status: HttpStatus.Created,
                    msg: "Bulk add category to stream success",
                });
            },
        );
    }
    private deleteCategoriesFromStream() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                StreamToCategoriesDTO.deleteCategoriesFromStreamSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");

                if (currentUser.stream.id != jsonData.streamId) {
                    throw new MyError.UnauthorizedError(
                        "You are not allowed to delete category from this stream",
                    );
                }
                const isSuccess =
                    this.categoryService.deleteCategoriesFromStream(jsonData);

                if (!isSuccess) {
                    throw new MyError.BadRequestError(
                        "Failed to bulk delete category to stream",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: undefined,
                    status: HttpStatus.Created,
                    msg: "Bulk delete category to stream success",
                });
            },
        );
    }
    private getCategoriesHandler() {
        const queries = z.object({
            id: z.string().uuid().optional(),
        });
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const currentUser = c.get("user");
                const id = c.req.valid("query").id;
                const streamId = id || currentUser?.stream.id;

                if (!streamId) {
                    throw new MyError.BadRequestError(
                        "Please provide a valid stream id",
                    );
                }
                const streamCategories =
                    await this.streamService.getStreamCategories(streamId);
                return ApiResponse.WriteJSON({
                    c,
                    data: streamCategories,
                    status: HttpStatus.OK,
                });
            },
        );
    }

    private generateTitleHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const stream = c.get("getUser").stream;
                const streamCateogories =
                    await this.streamService.getStreamCategories(stream.id);

                const builder = this.aiBuilder
                    .setBasePrompt(
                        `You are an expert Livestreaming title creator. Generate a title that is:
						- Attention-grabbing and emotionally compelling
						- Uses power words and action verbs 
						- Optimized for search and clicks
						- Maximum 50 characters
						- Single line response only
						- No hashtags or special characters
						- Naturally conversational tone
						- Includes numbers when relevant (e.g. "Top 5", "24 Hour")
						- Creates urgency or FOMO when appropriate
						- Uses proven headline formulas (How to, Ultimate Guide, etc.)
						- Incorporates trending keywords naturally
						- Balances clickability with authenticity
						- Considers target audience expectations
						- Uses alliteration when it fits naturally
						- Focuses on benefits/value to viewers
						`,
                    )
                    .addMessage({
                        role: "user",
                        content: `Generate a title for a Livestreaming`,
                    });

                if (!!streamCateogories) {
                    builder.addMessage({
                        role: "user",
                        content: `Generate a title for a Livestream with the following stream categories are: ${streamCateogories
                            .map((category) => category.category.name)
                            .join(", ")}`,
                    });
                }

                if (stream.thumbnailUrl.length > 0) {
                    builder.addMessage({
                        role: "user",
                        content: `Generate a title for a Livestreaming with the following image`,
                        experimental_attachments: [
                            {
                                url: stream.thumbnailUrl,
                                contentType: "image/png",
                            },
                        ],
                    });
                }

                const response = this.aiBuilder.build().getStreamText();
                return response.toDataStreamResponse();
            },
        );
    }
}
