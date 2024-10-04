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
            .get("/stream-token", ...this.getStreamToken());
    }
    private getStreamToken() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const stream = await this.streamService.getStreamWithSetting(
                    currentUser.id,
                );
                if (!stream || !stream.setting) {
                    throw new MyError.NotFoundError();
                }
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Get token successfully",
                    status: HttpStatus.Created,
                    data: {
                        token: stream.setting.streamKey,
                    },
                });
            },
        );
    }
}
