import { zValidator } from "@hono/zod-validator";
import { ReturnQueryFromVNPay } from "vnpay";
import { z } from "zod";

import { envClient } from "@/lib/env/env.client";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { IDonateCardService } from "../services/donate-card.service";
import { IDonationService } from "../services/donation.service";
import { IOrderService } from "../services/order.service";
import { IStreamService } from "../services/stream.service";

import { DonateCardDTO } from "../dtos/donate-card.dto";
import { DonationDTO } from "../dtos/donation.dto";
import { OrderDTO } from "../dtos/order.dto";

export interface IDonationController
    extends Utils.AutoMappedClass<DonationController> {}

export class DonationController implements IDonationController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly donationService: IDonationService,
        private readonly donateCardService: IDonateCardService,
        private readonly orderService: IOrderService,
        private readonly streamService: IStreamService,
    ) {}

    public setupHandlers() {
        return this.factory
            .createApp()
            .post("/donate", ...this.createDonationHandler())
            .get("/callback/:paymentMethod", ...this.donationCallbackHandler())

            .get("/cards/:streamId", ...this.getDonateCardsHandler())
            .post("/cards", ...this.createDonateCardHandler())
            .patch("/cards/:cardId", ...this.updateDonateCardHandler())
            .delete("/cards/:cardId", ...this.deleteDonateCardHandler())

            .post("/ipn/MOMO", ...this.momoIPNHandler())

            .get(
                "/cards-streamer/:streamerId",
                ...this.getDonationCardByStreamerIdHandler(),
            )

            .get("/analysis", ...this.getCompleteAnalysisHandler());
    }

    private createDonationHandler() {
        const bodySchema = DonationDTO.donationRequestSchema;
        return this.factory.createHandlers(
            zValidator("json", bodySchema, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const body = c.req.valid("json");
                const ipAddress =
                    c.req.header("x-forwarded-for") ||
                    c.req.header("x-real-ip") ||
                    "127.0.0.1";

                const stream = await this.streamService.getStreamByUserId(
                    body.streamerId || "",
                );

                if (!stream) {
                    throw new MyError.NotFoundError("Stream not found");
                }

                const result = await this.donationService.createDonation({
                    ...body,
                    donorId: currentUser.id,
                    ipAddress,
                    streamId: stream.id,
                    streamerId: stream.userId,
                });

                return ApiResponse.WriteJSON({
                    c,
                    data: result,
                    status: HttpStatus.Created,
                    msg: "Donation created successfully",
                });
            },
        );
    }

    private donationCallbackHandler() {
        const params = z.object({
            paymentMethod: OrderDTO.paymentMethodSchema,
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const query = c.req.query();
                const { paymentMethod } = c.req.valid("param");

                const result =
                    await this.donationService.handleDonationCallback(
                        paymentMethod,
                        query,
                    );

                if (result.success) {
                    return c.redirect(
                        `/donation-notice?success=true&orderId=${result.orderId}`,
                    );
                } else {
                    return c.redirect(
                        `/donation-notice?success=false&orderId=${result.orderId}&message=${encodeURIComponent(result.message)}`,
                    );
                }
            },
        );
    }

    private momoIPNHandler() {
        return this.factory.createHandlers(async (c) => {
            const query = await c.req.json();

            const result = await this.donationService.handleDonationCallback(
                "MOMO",
                query,
            );

            return c.body(null, HttpStatus.NoContent);
        });
    }

    private getDonateCardsHandler() {
        const params = z.object({
            streamId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const { streamId } = c.req.valid("param");
                const donateCards =
                    await this.donateCardService.getDonateCardsByStreamId(
                        streamId,
                    );

                return ApiResponse.WriteJSON({
                    c,
                    data: { donateCards },
                    status: HttpStatus.OK,
                    msg: "Donate cards retrieved successfully",
                });
            },
        );
    }

    private getDonationCardByStreamerIdHandler() {
        const params = z.object({
            streamerId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const { streamerId } = c.req.valid("param");
                const stream =
                    await this.streamService.getStreamByUserId(streamerId);

                if (!stream) {
                    throw new MyError.NotFoundError("Stream not found");
                }

                const donateCards =
                    await this.donateCardService.getDonateCardsByStreamId(
                        stream.id,
                    );

                return ApiResponse.WriteJSON({
                    c,
                    data: { donateCards },
                    status: HttpStatus.OK,
                    msg: "Donate cards retrieved successfully",
                });
            },
        );
    }

    private createDonateCardHandler() {
        const bodySchema = DonateCardDTO.insertSchema;
        return this.factory.createHandlers(
            zValidator("json", bodySchema, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const body = c.req.valid("json");
                const streamId = currentUser.stream.id;

                const donateCard =
                    await this.donateCardService.createDonateCard(
                        streamId,
                        body,
                    );

                return ApiResponse.WriteJSON({
                    c,
                    data: { donateCard },
                    status: HttpStatus.Created,
                    msg: "Donate card created successfully",
                });
            },
        );
    }

    private updateDonateCardHandler() {
        const params = z.object({
            cardId: z.string().uuid(),
        });
        const bodySchema = DonateCardDTO.updateSchema;
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator("json", bodySchema, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const { cardId } = c.req.valid("param");
                const body = c.req.valid("json");

                // Use the current user's stream ID
                const streamId = currentUser.stream.id;
                const donateCard =
                    await this.donateCardService.updateDonateCard(
                        cardId,
                        streamId,
                        {
                            title: body.title,
                            description: body.description,
                            amount: body.amount,
                            imageUrl: body.imageUrl,
                            isActive: body.isActive,
                            displayOrder: body.displayOrder,
                        },
                    );
                return ApiResponse.WriteJSON({
                    c,
                    data: { donateCard },
                    status: HttpStatus.OK,
                    msg: "Donate card updated successfully",
                });
            },
        );
    }

    private deleteDonateCardHandler() {
        const params = z.object({
            cardId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { cardId } = c.req.valid("param");
                const currentUser = c.get("getUser");
                const streamId = currentUser.stream.id;

                const isSuccess = await this.donateCardService.deleteDonateCard(
                    cardId,
                    streamId,
                );

                if (!isSuccess) {
                    throw new MyError.BadRequestError(
                        "Failed to delete donate card",
                    );
                }

                return ApiResponse.WriteJSON({
                    c,
                    status: HttpStatus.OK,
                    msg: "Donate card deleted successfully",
                    data: undefined,
                });
            },
        );
    }

    private getCompleteAnalysisHandler() {
        const querySchema = z.object({
            period: z.string().optional().default("all"),
        });

        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            zValidator("query", querySchema, Validator.handleParseError),
            async (c) => {
                const { period } = c.req.valid("query");
                const currentUser = c.get("getUser");

                const analysis =
                    await this.orderService.getCompleteDonationAnalysis(
                        currentUser.stream.id,
                        period,
                    );

                return ApiResponse.WriteJSON({
                    c,
                    data: analysis,
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
