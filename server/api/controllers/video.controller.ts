import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { BlockUtils } from "../lib/helpers/block-util";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { ICategoryService } from "../services/category.service";
import { IFollowService } from "../services/follow.service";
import { IVideoService } from "../services/video.service";

import { AIServiceBuilder } from "../external-services/ai.service";

import { FollowDTO } from "../dtos/follow.dto";
import { QueryDTO } from "../dtos/query.dto";
import { VideoDTO } from "../dtos/video.dto";
import { VideoToCategoriesDTO } from "../dtos/videoToCategories.dto";

export interface IVideoController
    extends Utils.PickMethods<VideoController, "setupHandlers"> {}
export class VideoController implements IVideoController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly videoService: IVideoService,
        private readonly aiServiceBuilder: AIServiceBuilder,
        private readonly categoryService: ICategoryService,
        private readonly followService: IFollowService,
    ) {}
    public setupHandlers() {
        return (
            this.factory
                .createApp()
                .use(AuthMiddleware.isAuthenticated)
                .get("/", ...this.getAllVideos())
                .post("/", ...this.createVideo())
                .get("/username/:username", ...this.getVideosWithUsername())
                // me
                .get("/me", ...this.getOwnedVideos())
                // cateogries
                .get("/categories", ...this.getCategoriesHandler())
                .post("/add-categories", ...this.addCategoriesToVideo())
                // AI
                .post("/generate-title", ...this.generateTitle())
                .post("/generate-description", ...this.generateDescription())
                // video id
                .get("/:id", ...this.getVideoById())
                .get("/:id/relate", ...this.getRelateVideo())
                .patch("/:id", ...this.updateVideo())
                .delete("/:id", ...this.deleteVideoById())
        );
    }
    private getAllVideos() {
        const respSchema = VideoDTO.selectSchema.array();
        return this.factory.createHandlers(async (c) => {
            const videos = await this.videoService.getAllVideos();
            return ApiResponse.WriteJSON({
                c,
                data: respSchema.parse(videos),
                status: HttpStatus.OK,
            });
        });
    }
    private createVideo() {
        const reqSchema = VideoDTO.insertSchema.omit({
            userId: true,
            streamId: true,
        });
        const respSchema = VideoDTO.selectSchema;

        return this.factory.createHandlers(
            zValidator("json", reqSchema),
            async (c) => {
                const jsonData = c.req.valid("json");
                const user = c.get("getUser");
                const video = await this.videoService.createVideo({
                    ...jsonData,
                    userId: user.id,
                    streamId: user.stream.id,
                });

                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.parse(video),
                    status: HttpStatus.Created,
                });
            },
        );
    }
    private getVideoById() {
        const respSchema = VideoDTO.videoWithUser;
        const params = z.object({
            id: z.string().uuid(),
        });

        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const currentUser = c.get("user");
                const params = c.req.valid("param");
                const video = await this.videoService.getVideoById(params.id);
                if (!video) {
                    throw new MyError.BadRequestError("Video not found");
                }
                const categories = video.videosToCategories.map(
                    (videoToCategory) => videoToCategory.category,
                );
                const formattedData = {
                    ...video,
                    categories,
                };
                const isCurrentUserDifferent =
                    currentUser && currentUser.id !== video.userId;
                isCurrentUserDifferent &&
                    (await BlockUtils.checkUserBlock(
                        currentUser.id,
                        video.userId,
                    ));

                const followers = await this.followService.findFollowerByUserId(
                    video.userId,
                );

                const responseData = {
                    ...respSchema.parse(formattedData),
                    followers: followers?.length || 0,
                    isFollowing: false,
                    isLiked: false,
                    isDisliked: false,
                    isBlocked: false,
                };
                if (isCurrentUserDifferent) {
                    responseData.isFollowing = !!followers?.find(
                        (follower) => follower.id === currentUser.id,
                    );
                }
                responseData.isLiked =
                    video.videoLikes.find(
                        (videoLike) => videoLike.userId === currentUser?.id,
                    )?.type === 1;
                responseData.isDisliked =
                    video.videoLikes.find(
                        (videoLike) => videoLike.userId === currentUser?.id,
                    )?.type === -1;
                return ApiResponse.WriteJSON({
                    c,
                    data: responseData,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getRelateVideo() {
        const respSchema = VideoDTO.selectSchema;
        const params = z.object({
            id: z.string().uuid(),
        });

        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const params = c.req.valid("param");
                const videos = await this.videoService.getRelateVideo(
                    params.id,
                );
                if (!videos) {
                    throw new MyError.BadRequestError("Video not found");
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.array().parse(videos),
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getOwnedVideos() {
        const respSchema = VideoDTO.selectSchema;
        const queries = QueryDTO.createPaginationSchema(1, 5);
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const user = c.get("getUser");
                const { page, size } = c.req.valid("query");
                const videos = await this.videoService.getVideosByUserId(
                    user.id,
                    (page - 1) * size,
                    size,
                );
                if (!videos) {
                    throw new MyError.BadRequestError("Video not found");
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        videos: respSchema.array().parse(videos.videos),
                        totalRecords: videos.totalRecords,
                        currentOffset: page - 1,
                        limit: size,
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private updateVideo() {
        const reqSchema = VideoDTO.updateSchema.omit({
            userId: true,
            streamId: true,
            id: true,
        });
        const respSchema = VideoDTO.selectSchema;
        const params = z.object({
            id: z.string().uuid(),
        });

        return this.factory.createHandlers(
            zValidator("json", reqSchema, Validator.handleParseError),
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const jsonData = c.req.valid("json");
                const params = c.req.valid("param");
                const video = await this.videoService.updateVideo(
                    params.id,
                    jsonData,
                );
                if (!video) {
                    throw new MyError.NotFoundError("Failed to update video");
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.parse(video),
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private deleteVideoById() {
        const params = z.object({
            id: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const params = c.req.valid("param");
                const isSuccess = await this.videoService.deleteVideo(
                    params.id,
                );
                if (!isSuccess) {
                    throw new MyError.NotFoundError("Video not found");
                }
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Video deleted successfully",
                    data: undefined,
                    status: HttpStatus.OK,
                });
            },
        );
    }

    private generateTitle() {
        const reqSchema = z.object({
            imageUrl: z.string().optional().nullable(),
            videoId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("json", reqSchema, Validator.handleParseError),
            async (c) => {
                const { imageUrl, videoId } = c.req.valid("json");
                const categories =
                    await this.videoService.getVideoCategories(videoId);
                const builder = this.aiServiceBuilder
                    .setBasePrompt(
                        `You are an expert video title creator. Generate a title that is:
						- Attention-grabbing and emotionally compelling
						- Uses power words and action verbs
						- Optimized for search and clicks
						- Maximum 50 characters
						- Single line response only
						- No hashtags or special characters
						- Naturally conversational tone
						`,
                    )
                    .addMessage({
                        role: "user",
                        content: `Generate a title for a video`,
                    });

                if (!!imageUrl && imageUrl.length > 0) {
                    builder.addMessage({
                        role: "user",
                        content: `Generate a title for a video with the following image`,
                        experimental_attachments: [
                            {
                                url: imageUrl,
                                contentType: "image/png",
                            },
                        ],
                    });
                }
                if (!!categories) {
                    builder.addMessage({
                        role: "user",
                        content: `Generate a title for a video with the following categories are: ${categories
                            .map((category) => category.category.name)
                            .join(", ")}`,
                    });
                }
                const aiService = builder.build();
                const response = aiService.getStreamText();
                return response.toDataStreamResponse();
            },
        );
    }
    private generateDescription() {
        const reqSchema = z.object({
            imageUrl: z.string().optional().nullable(),
            videoId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("json", reqSchema, Validator.handleParseError),
            async (c) => {
                const { imageUrl, videoId } = c.req.valid("json");
                const categories =
                    await this.videoService.getVideoCategories(videoId);

                const builder = this.aiServiceBuilder
                    .setBasePrompt(
                        `You are an expert video description creator. Generate a description that is:
						- Attention-grabbing and emotionally compelling
						- Uses power words and action verbs
						- Optimized for search and clicks
						- Maximum 100 words
						- Single line response only
						- No hashtags or special characters
						- Naturally conversational tone
						`,
                    )
                    .addMessage({
                        role: "user",
                        content: `Generate a description for a video`,
                    });

                if (!!imageUrl && imageUrl.length > 0) {
                    builder.addMessage({
                        role: "user",
                        content: `Generate a description for a video with the following image`,
                        experimental_attachments: [
                            {
                                url: imageUrl,
                                contentType: "image/png",
                            },
                        ],
                    });
                }
                if (!!categories) {
                    builder.addMessage({
                        role: "user",
                        content: `Generate a description for a video with the following categories are: ${categories
                            .map((category) => category.category.name)
                            .join(", ")}`,
                    });
                }
                const aiService = builder.build();
                const response = aiService.getStreamText();
                return response.toDataStreamResponse();
            },
        );
    }
    private addCategoriesToVideo() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                VideoToCategoriesDTO.addCategoriesToVideoSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");
                const isOwner = await this.videoService.checkOwnVideo(
                    currentUser.id,
                    jsonData.videoId,
                );
                //Check video for user

                if (!isOwner) {
                    throw new MyError.UnauthorizedError(
                        "You are not allowed to add categories to this video",
                    );
                }
                if (!jsonData.categoryIds.length) {
                    await this.categoryService.deleteAllCategoriesFromVideo(
                        jsonData.videoId,
                    );
                    return ApiResponse.WriteJSON({
                        c,
                        data: undefined,
                        status: HttpStatus.Created,
                        msg: "Bulk add category to video success",
                    });
                }
                const isSuccess =
                    await this.categoryService.addCategoriesToVideo(
                        jsonData.categoryIds.map((categoryId: string) => ({
                            categoryId: categoryId,
                            videoId: jsonData.videoId,
                        })),
                    );
                if (!isSuccess) {
                    throw new MyError.BadRequestError(
                        "Failed to bulk add category to video",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: undefined,
                    status: HttpStatus.Created,
                    msg: "Bulk add category to video success",
                });
            },
        );
    }
    private getCategoriesHandler() {
        const queries = z.object({
            id: z.string().optional(),
        });
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { id } = c.req.valid("query");
                if (!id) {
                    throw new MyError.BadRequestError(
                        "Please provide a valid video id",
                    );
                }
                const videoCategories =
                    await this.videoService.getVideoCategories(id);
                return ApiResponse.WriteJSON({
                    c,
                    data: videoCategories,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private getVideosWithUsername() {
        const respSchema = VideoDTO.selectSchema;
        const params = z.object({
            username: z.string(),
        });
        const queries = z
            .object({
                categoryId: z.string().uuid().optional(),
            })
            .merge(QueryDTO.createPaginationSchema(1, 5));
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const { page, size } = c.req.valid("query");
                const { username } = c.req.valid("param");
                const videos = await this.videoService.getVideosWithUsername(
                    username,
                    (page - 1) * size,
                    size,
                );
                if (!videos) {
                    throw new MyError.BadRequestError("Videos not found");
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        videos: respSchema.array().parse(videos.videos),
                        totalRecords: videos.totalRecords,
                        currentOffset: page - 1,
                        limit: size,
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
