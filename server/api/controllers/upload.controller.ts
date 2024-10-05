import { R2BucketDTO } from "../dtos/r2-bucket.dto";
import { IR2BucketService } from "../external-services/r2-bucket.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IStreamService } from "../services/stream.service";
import { IUserService } from "../services/user.service";
import { zValidator } from "@hono/zod-validator";

export interface IUploadController
    extends Utils.AutoMappedClass<UploadController> {}

export class UploadController implements IUploadController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly r2BucketService: IR2BucketService,
        private readonly userService: IUserService,
        private readonly streamService: IStreamService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .post("/avatar", ...this.uploadUserAvatarHandler())
            .post("/thumbnail", ...this.uploadStreamThumbnailHandler());
    }
    private uploadUserAvatarHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                R2BucketDTO.uploadFileSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");
                const { imageUrl, signedUrl } =
                    await this.r2BucketService.generateSignedUrl(jsonData);
                if (!signedUrl || !imageUrl) {
                    throw new MyError.ServiceUnavailableError(
                        "Cannot upload image right now",
                    );
                }
                const updatedUser = await this.userService.updateUser(
                    currentUser.id,
                    {
                        imageUrl,
                    },
                );
                if (!updatedUser) {
                    throw new MyError.ServiceUnavailableError(
                        "Cannot upload image right now",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.Created,
                    data: {
                        imageUrl,
                        signedUrl,
                    },
                    msg: "Get signed URL successfully",
                });
            },
        );
    }
    private uploadStreamThumbnailHandler() {
        return this.factory.createHandlers(
            zValidator(
                "json",
                R2BucketDTO.uploadFileSchema,
                Validator.handleParseError,
            ),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");
                const { imageUrl, signedUrl } =
                    await this.r2BucketService.generateSignedUrl(jsonData);
                if (!signedUrl || !imageUrl) {
                    throw new MyError.ServiceUnavailableError(
                        "Cannot upload image right now",
                    );
                }
                const updatedStream = await this.streamService.updateStream(
                    currentUser.stream.id,
                    {
                        thumbnailUrl: imageUrl,
                    },
                );
                if (!updatedStream) {
                    throw new MyError.ServiceUnavailableError(
                        "Cannot upload thumbnail right now",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.Created,
                    data: {
                        imageUrl,
                        signedUrl,
                    },
                    msg: "Get signed URL successfully",
                });
            },
        );
    }
}
