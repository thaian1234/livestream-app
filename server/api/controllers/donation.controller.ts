import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { IDonateCardService } from "../services/donate-card.service";
import { IDonationService } from "../services/donation.service";

import { DonateCardDTO } from "../dtos/donate-card.dto";
import { DonationDTO } from "../dtos/donation.dto";

export interface IDonationController {
    setupHandlers(): any;
}

export class DonationController implements IDonationController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly donationService: IDonationService,
        private readonly donateCardService: IDonateCardService,
    ) {}

    public setupHandlers() {
        return this.factory
            .createApp()
            .post("/donate", ...this.createDonationHandler())
            .get("/callback", ...this.donationCallbackHandler())
            .get("/cards/:streamId", ...this.getDonateCardsHandler())
            .post("/cards", ...this.createDonateCardHandler())
            .patch("/cards/:id", ...this.updateDonateCardHandler())
            .delete("/cards/:id", ...this.deleteDonateCardHandler());
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

                const result = await this.donationService.createDonation({
                    donorId: currentUser.id,
                    ipAddress,
                    ...body,
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
        return this.factory.createHandlers(async (c) => {
            const query = c.req.query();

            try {
                const result =
                    await this.donationService.handleDonationCallback({
                        vnp_Amount: query.vnp_Amount,
                        vnp_BankCode: query.vnp_BankCode,
                        vnp_BankTranNo: query.vnp_BankTranNo,
                        vnp_CardType: query.vnp_CardType,
                        vnp_OrderInfo: query.vnp_OrderInfo,
                        vnp_ResponseCode: query.vnp_ResponseCode,
                        vnp_TmnCode: query.vnp_TmnCode,
                        vnp_TxnRef: query.vnp_TxnRef,
                    });

                if (result.success) {
                    return c.redirect(
                        `/donation/success?orderId=${result.orderId}`,
                    );
                } else {
                    return c.redirect(
                        `/donation/failed?orderId=${result.orderId}&message=${encodeURIComponent(result.message)}`,
                    );
                }
            } catch (error) {
                console.error("Donation callback error:", error);
                return c.redirect(
                    `/donation/failed?message=${encodeURIComponent("An error occurred during payment processing")}`,
                );
            }
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
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const { cardId } = c.req.valid("param");
                const body = await c.req.json();

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
}
