import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { zValidator } from "@hono/zod-validator";
import { CoreMessage, Message } from "ai";
import { z } from "zod";

import { envServer } from "@/lib/env/env.server";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { IVideoService } from "../services/video.service";

import { AIServiceBuilder } from "../external-services/ai.service";

import { VideoDTO } from "../dtos/video.dto";

export interface IVideoController
    extends Utils.PickMethods<VideoController, "setupHandlers"> {}
export class VideoController implements IVideoController {
    private readonly google;
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly videoService: IVideoService,
        private readonly aiServiceBuilder: AIServiceBuilder,
    ) {
        this.google = createGoogleGenerativeAI({
            apiKey: envServer.GOOGLE_GENERATIVE_AI_API_KEY,
        });
    }
    public setupHandlers() {
        return this.factory
            .createApp()
            .use(AuthMiddleware.isAuthenticated)
            .get("/", ...this.getAllVideos())
            .post("/", ...this.createVideo())
            .post("/generate-title", ...this.generateTitle())
            .post("/generate-description", ...this.generateDescription())
            .get("/:id", ...this.getVideoById())
            .patch("/:id", ...this.updateVideo())
            .delete("/:id", ...this.deleteVideoById());
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
        const respSchema = VideoDTO.selectSchema;
        const params = z.object({
            id: z.string().uuid(),
        });

        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const params = c.req.valid("param");
                const video = await this.videoService.getVideoById(params.id);
                if (!video) {
                    throw new MyError.BadRequestError("Video not found");
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.parse(video),
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
        });
        return this.factory.createHandlers(
            zValidator("json", reqSchema, Validator.handleParseError),
            async (c) => {
                const { imageUrl } = c.req.valid("json");
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

                if (!!imageUrl) {
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
                const aiService = builder.build();
                const response = aiService.getStreamText();
                return response.toDataStreamResponse();
            },
        );
    }
    private generateDescription() {
        const reqSchema = z.object({
            imageUrl: z.string().optional().nullable(),
        });
        return this.factory.createHandlers(
            zValidator("json", reqSchema, Validator.handleParseError),
            async (c) => {
                const { imageUrl } = c.req.valid("json");
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

                if (!!imageUrl) {
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
                const aiService = builder.build();
                const response = aiService.getStreamText();
                return response.toDataStreamResponse();
            },
        );
    }
}
