import { INotificationService } from "../external-services/notification.service";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { AuthMiddleware } from "../middleware/auth.middleware";

export interface INotificationController
    extends Utils.AutoMappedClass<NotificationController> {}
export class NotificationController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly notificationService: INotificationService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .get("/notification-token", ...this.getNotificationTokenHandler());
    }
    private getNotificationTokenHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const token = this.notificationService.generateUserToken(
                    currentUser.id,
                );
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Get token successfully",
                    data: {
                        token: token,
                    },
                    status: HttpStatus.Created,
                });
            },
        );
    }
}
