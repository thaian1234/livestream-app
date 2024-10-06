import { IGetStreamService } from "../external-services/getstream.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ISettingService } from "../services/setting.service";

export interface ISettingController
    extends Utils.PickMethods<SettingController, "setupHandlers"> {}

export class SettingController implements ISettingController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly settingService: ISettingService,
        private readonly getStreamService: IGetStreamService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .get("/", ...this.getSettingByStreamIdHandler())
            .patch("/generate-key", ...this.generateKeyHandler());
    }
    private getSettingByStreamIdHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const setting = await this.settingService.getSettingByStreamId(
                    currentUser.stream.id,
                );
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        setting,
                    },
                    status: HttpStatus.OK,
                    msg: "Fetching setting successfully",
                });
            },
        );
    }
    private generateKeyHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const streamKey = this.getStreamService.generateUserToken(
                    currentUser.id,
                );

                const livestreamRoom =
                    await this.getStreamService.upsertLivestreamRoom(
                        currentUser,
                        currentUser.stream.id,
                    );
                const updatedSetting =
                    await this.settingService.upsertByStreamId(
                        currentUser.stream.id,
                        {
                            streamKey: streamKey,
                            serverUrl: livestreamRoom.call.ingress.rtmp.address,
                        },
                    );
                if (!updatedSetting) {
                    throw new MyError.ServiceUnavailableError(
                        "Cannot update Setting",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    data: undefined,
                    msg: "Setting updated",
                });
            },
        );
    }
}
