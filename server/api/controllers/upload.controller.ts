import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { IStorageService } from "../services/storage.service";
import { IStreamService } from "../services/stream.service";
import { IUserService } from "../services/user.service";
import { IVideoService } from "../services/video.service";

import { IR2BucketService } from "../external-services/r2-bucket.service";

import { R2BucketDTO } from "../dtos/r2-bucket.dto";

export interface IUploadController
    extends Utils.AutoMappedClass<UploadController> {}

export class UploadController implements IUploadController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly r2BucketService: IR2BucketService,
        private readonly userService: IUserService,
        private readonly streamService: IStreamService,
        private readonly videoService: IVideoService,
        private readonly storageService: IStorageService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .use(AuthMiddleware.isAuthenticated)
            .post("/:type", ...this.unifiedUploadHandler());
    }
    private unifiedUploadHandler() {
        const params = z.object({
            type: z.enum([
                "user-avatar",
                "stream-thumbnail",
                "video-thumbnail",
                "video-recording",
            ]),
        });
        const queries = z.object({
            videoId: z.string().optional(),
        });
        return this.factory.createHandlers(
            zValidator(
                "json",
                R2BucketDTO.uploadFileSchema,
                Validator.handleParseError,
            ),
            zValidator("param", params, Validator.handleParseError),
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");
                console.log(jsonData);
                const type = c.req.valid("param").type;
                const { fileUrl, signedUrl } =
                    await this.r2BucketService.generateSignedUrl(jsonData);
                if (!signedUrl || !fileUrl) {
                    console.log("I should be here");
                    throw new MyError.ServiceUnavailableError(
                        "Cannot upload image right now",
                    );
                }

                let updatedEntity = null;
                switch (type) {
                    case "user-avatar":
                        updatedEntity = await this.userService.updateUser(
                            currentUser.id,
                            { imageUrl: fileUrl },
                        );
                        break;
                    case "stream-thumbnail":
                        updatedEntity = await this.streamService.updateStream(
                            currentUser.stream.id,
                            { thumbnailUrl: fileUrl },
                        );
                        break;
                    case "video-thumbnail":
                        const videoId = c.req.valid("query").videoId;
                        if (!videoId) {
                            throw new MyError.BadRequestError(
                                "Video ID is required in query parameters",
                            );
                        }
                        const existingVideo =
                            await this.videoService.getVideoById(videoId);
                        if (!existingVideo) {
                            throw new MyError.NotFoundError("Video not found");
                        }
                        if (
                            existingVideo.userId !== currentUser.id ||
                            existingVideo.streamId !== currentUser.stream.id
                        ) {
                            throw new MyError.UnauthorizedError(
                                "You are not authorized to update this video",
                            );
                        }
                        updatedEntity = await this.videoService.updateVideo(
                            videoId,
                            { thumbnailUrl: fileUrl },
                        );
                        break;
                    case "video-recording":
                        const startTime = new Date();
                        const endTime = new Date(
                            startTime.getTime() +
                                (jsonData.duration || 0) * 1000,
                        );
                        updatedEntity = await this.storageService.createAsset({
                            streamId: currentUser.stream.id,
                            fileName: jsonData.fileName,
                            fileUrl: fileUrl,
                            fileType: jsonData.fileType,
                            startTime: startTime,
                            endTime: endTime,
                        });
                        break;
                    default:
                        throw new MyError.BadRequestError(
                            "Invalid upload type",
                        );
                }
                if (!updatedEntity) {
                    throw new MyError.ServiceUnavailableError(
                        "Cannot update file right now",
                    );
                }

                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.Created,
                    data: { fileUrl, signedUrl },
                    msg: "Get signed URL successfully",
                });
            },
        );
    }
}
