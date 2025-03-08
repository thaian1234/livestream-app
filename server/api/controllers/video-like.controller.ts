import { zValidator } from "@hono/zod-validator";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { IVideoLikeService } from "../services/video-like.service";
import { IVideoService } from "../services/video.service";

import { VideoLikeDTO } from "../dtos/video-like.dto";

export interface IVideoLikeController
    extends Utils.PickMethods<VideoLikeController, "setupHandlers"> {}
export class VideoLikeController implements IVideoLikeController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly videolikeService: IVideoLikeService,
        private readonly videoService: IVideoService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .use(AuthMiddleware.isAuthenticated)
            .post("/", ...this.createVideoLike());
    }
    private createVideoLike() {
        const reqSchema = VideoLikeDTO.toggleSchema.omit({
            userId: true,
        });

        return this.factory.createHandlers(
            zValidator("json", reqSchema, Validator.handleParseError),
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");

                const msg = await this.videolikeService.toggleLike(
                    currentUser.id,
                    jsonData.videoId,
                    jsonData.isLike,
                );

                if (!msg) {
                    throw new MyError.BadRequestError(
                        "Failed to interact with video",
                    );
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: jsonData.videoId,
                    msg: msg,
                    status: HttpStatus.Created,
                });
            },
        );
    }
}
