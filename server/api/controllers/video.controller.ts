import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { zValidator } from "@hono/zod-validator";
import { streamText } from "ai";
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

import { IGetStreamService } from "../external-services/getstream.service";

import { VideoDTO } from "../dtos/video.dto";

export interface IVideoController
    extends Utils.PickMethods<VideoController, "setupHandlers"> {}
export class VideoController implements IVideoController {
    private readonly google;
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly videoService: IVideoService,
        private readonly getStreamService: IGetStreamService,
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
            .post("/generate-title", ...this.generateVideoTitle())
            .get("/:id", ...this.getVideoById())
            .post("/", ...this.createVideo())
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
            AuthMiddleware.isAuthenticated,
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
    private generateVideoTitle() {
        return this.factory.createHandlers(async (c) => {
            const { imageUrl } = await c.req.json();

            const result = streamText({
                model: this.google("gemini-2.0-pro-exp-02-05"),
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a video title generator. The answer should be in one single line, and should be short and catchy. Limit 50 characters.",
                    },
                    {
                        role: "user",
                        content: `Generate a title for a video with the following image`,
                        experimental_attachments: [
                            {
                                url: imageUrl,
                                contentType: "image/png",
                            },
                        ],
                    },
                ],
                onError(err) {
                    console.error(err);
                },
                temperature: 1,
            });
            return result.toDataStreamResponse();
        });
    }
}
