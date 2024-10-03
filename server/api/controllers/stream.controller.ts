import { StreamDTO } from "../dtos/stream.dto";
import { IGetStreamService } from "../external-services/getstream.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IStreamService } from "../services/stream.service";
import { zValidator } from "@hono/zod-validator";

export interface IStreamController
    extends Utils.AutoMappedClass<StreamController> {}

export class StreamController implements IStreamController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly streamService: IStreamService,
        private readonly getStreamService: IGetStreamService,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/generate-token", ...this.generateUserToken())
            .get("/", ...this.upsertLivestreamRoom())
            .post("/", ...this.createLivestreamRoom())
            .post("/generate-token", ...this.generateUserToken())
            .post("/create", ...this.createStream())
            .get("/my-stream", ...this.getSelfStream());
    }
    private createLivestreamRoom() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const getStreamUser =
                    this.getStreamService.convertUserToUserRequest(currentUser);
                const call =
                    await this.getStreamService.createLivestreamRoom(
                        getStreamUser,
                    );
                if (!call.created) {
                    return ApiResponse.WriteErrorJSON({
                        c,
                        status: HttpStatus.ServiceUnavailable,
                        msg: "Cannot create Livestream room",
                    });
                }
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Livestream room created !",
                    status: HttpStatus.Created,
                    data: {
                        room: call,
                    },
                });
            },
        );
    }
    private upsertLivestreamRoom() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const getStreamUser =
                    this.getStreamService.convertUserToUserRequest(currentUser);
                const call =
                    await this.getStreamService.upsertLivestreamRoom(
                        getStreamUser,
                    );
                if (!call.created) {
                    return ApiResponse.WriteErrorJSON({
                        c,
                        status: HttpStatus.ServiceUnavailable,
                        msg: "Cannot create Livestream room",
                    });
                }
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Livestream room created !",
                    status: HttpStatus.Created,
                    data: {
                        room: call,
                    },
                });
            },
        );
    }
    private generateUserToken() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const token = this.getStreamService.generateUserToken(
                    currentUser.id,
                );
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Token generated",
                    status: HttpStatus.Created,
                    data: {
                        token,
                    },
                });
            },
        );
    }
    private createStream() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            zValidator(
                "json",
                StreamDTO.insertSchema,
                Validator.handleParseError,
            ),
            async (c) => {
                const currentUser = c.get("getUser");
                const jsonData = c.req.valid("json");
                if (currentUser.id !== jsonData.userId) {
                    throw new MyError.UnauthorizedError();
                }
                const newStream = await this.streamService.createOne(jsonData);
                if (!newStream) {
                    throw new MyError.BadRequestError("Cannot create Stream");
                }
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Stream created",
                    data: {
                        stream: newStream,
                    },
                    status: HttpStatus.Created,
                });
            },
        );
    }
    public getSelfStream() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const stream = await this.streamService.getStreamWithSetting(
                    currentUser.id,
                );
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Get stream successfully",
                    status: HttpStatus.OK,
                    data: {
                        stream: stream,
                    },
                });
            },
        );
    }
}
