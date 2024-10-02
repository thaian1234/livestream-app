import { IGetStreamService } from "../external-services/getstream.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { AuthMiddleware } from "../middleware/auth.middleware";

export interface IStreamController
    extends Utils.AutoMappedClass<StreamController> {}

export class StreamController implements IStreamController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly getStreamService: IGetStreamService,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/generate-token", ...this.generateUserToken())
            .get("/", ...this.upsertLivestreamRoom())
            .post("/", ...this.createLivestreamRoom())
            .post("/generate-token", ...this.generateUserToken());
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
}
