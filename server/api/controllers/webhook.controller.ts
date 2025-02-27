import {
    CallRecordingReadyEvent,
    CallRecordingStartedEvent,
} from "@stream-io/node-sdk";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";

import { IStorageService } from "../services/storage.service";

import { IGetStreamService } from "../external-services/getstream.service";

export class WebhookController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly getstreamService: IGetStreamService,
        private readonly storageService: IStorageService,
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

                if (!signature || !webhookId || !apiKey) {
                    throw new MyError.ValidationError(
                        "Missing required headers (signature, webhookId, apiKey)",
                    );
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
                let promise: Promise<unknown> | null = null;
                switch (body.type) {
                    case "call.recording_ready":
                        promise = this.handleRecordingReady(body);
                        break;
                    default:
                        console.log("Unhandled event type: ", body.type, body);
                }

                if (promise) {
                    c.var.executionCtx.waitUntil(
                        promise
                            .then((data) =>
                                console.log("promise resolve: ", data),
                            )
                            .catch((err) => {
                                console.error(
                                    "Error processing webhook: ",
                                    err,
                                );
                            }),
                    );
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

    private async handleRecordingReady(body: CallRecordingReadyEvent) {
        const streamId = body.call_cid.split(":")[1];
        if (!streamId) {
            throw new MyError.ValidationError("Invalid streamId");
        }
        return this.storageService.createAsset({
            streamId: streamId,
            fileName: body.call_recording.filename,
            startTime: new Date(body.call_recording.start_time),
            endTime: new Date(body.call_recording.end_time),
            fileUrl: body.call_recording.url,
            status: "ready",
        });
    }
}
