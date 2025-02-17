import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { CreateFactoryType } from "../lib/types/factory.type";

import { IGetStreamService } from "../external-services/getstream.service";

export class WebhookController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly getstreamService: IGetStreamService,
    ) {}

    public setupHandlers() {
        return this.factory
            .createApp()
            .post("/getstream", ...this.handleWebhook());
    }

    private handleWebhook() {
        return this.factory.createHandlers(async (c) => {
            try {
                const signature = c.req.header("X-SIGNATURE");
                const webhookId = c.req.header("X-WEBHOOK-ID");
                const apiKey = c.req.header("X-API-KEY");

                if (!signature) {
                    throw new MyError.ValidationError("Missing signature");
                }
                if (!webhookId) {
                    throw new MyError.ValidationError("Missing webhookId");
                }
                if (!apiKey) {
                    throw new MyError.ValidationError("Missing apiKey");
                }

                const rawBody = await c.req.raw.text();
                const body = JSON.parse(rawBody);

                console.log("Webhook payload received: ", body);

                const isValid = this.getstreamService.verifyWebhook(
                    rawBody,
                    signature,
                );
                if (!isValid) {
                    console.log("Invalid signature: ", body);
                    throw new MyError.UnauthorizedError("Invalid signature");
                }

                switch (body.type) {
                    case "call.recording_ready":
                        // await this.handleRecordingReady(body);
                        break;
                    case "call.recording_started":
                        // await this.handleRecordingStarted(body);
                        break;
                    case "call.recording_stopped":
                        // await this.handleRecordingStopped(body);
                        break;
                    default:
                        // Log unknown event types instead of failing
                        console.log("Unhandled event type: ", body.type, body);
                }

                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    msg: "Webhook processed successfully",
                    data: undefined,
                });
            } catch (error) {
                // Log error but still return 200 to acknowledge receipt
                console.error("Webhook processing error: ", error);
                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    msg: "Webhook received",
                    data: undefined,
                });
            }
        });
    }
}
