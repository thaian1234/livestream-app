import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { IOrderService } from "../services/order.service";
import { IStreamService } from "../services/stream.service";

import { OrderDTO } from "../dtos/order.dto";
import { QueryDTO } from "../dtos/query.dto";

export interface IOrderController
    extends Utils.AutoMappedClass<OrderController> {}

export class OrderController implements IOrderController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly orderService: IOrderService,
        private readonly streamService: IStreamService,
    ) {}

    setupHandlers() {
        return this.factory
            .createApp()
            .get("/user", ...this.getUserOrdersHandler())
            .get("/stream/:streamId", ...this.getStreamOrdersHandler())
            .get("/stats/:streamId", ...this.getDonationStatsHandler())
            .get("/:id", ...this.getOrderByIdHandler());
    }

    private getOrderByIdHandler() {
        const params = z.object({
            id: z.string().uuid(),
        });
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const { id } = c.req.valid("param");
                const currentUser = c.get("getUser");

                const order = await this.orderService.getOrderById(id);
                if (!order) {
                    throw new MyError.NotFoundError("Order not found");
                }

                if (order.userId !== currentUser.id) {
                    throw new MyError.UnauthorizedError();
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: OrderDTO.selectSchema.parse(order),
                    status: HttpStatus.OK,
                });
            },
        );
    }

    private getUserOrdersHandler() {
        const querySchema = QueryDTO.createPaginationSchema();

        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            zValidator("query", querySchema, Validator.handleParseError),
            async (c) => {
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("getUser");

                const orders = await this.orderService.getUserOrders(
                    currentUser.id,
                    page,
                    size,
                );

                return ApiResponse.WriteJSON({
                    c,
                    data: orders,
                    status: HttpStatus.OK,
                });
            },
        );
    }

    private getStreamOrdersHandler() {
        const querySchema = QueryDTO.createPaginationSchema();

        const params = z.object({
            streamId: z.string().uuid(),
        });

        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            zValidator("query", querySchema, Validator.handleParseError),
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const { page, size } = c.req.valid("query");
                const { streamId } = c.req.valid("param");
                const currentUser = c.get("getUser");

                const stream = await this.streamService.findById(streamId);
                if (!stream) {
                    throw new MyError.NotFoundError("Stream not found");
                }

                if (stream.userId !== currentUser.id) {
                    throw new MyError.UnauthorizedError();
                }

                const orders = await this.orderService.getStreamOrders(
                    streamId,
                    page,
                    size,
                );

                return ApiResponse.WriteJSON({
                    c,
                    data: orders,
                    status: HttpStatus.OK,
                });
            },
        );
    }

    private getDonationStatsHandler() {
        const querySchema = z.object({
            period: z.string().optional().default("all"),
        });

        const params = z.object({
            streamId: z.string().uuid(),
        });

        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            zValidator("query", querySchema, Validator.handleParseError),
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const { period } = c.req.valid("query");
                const { streamId } = c.req.valid("param");
                const currentUser = c.get("getUser");

                const stream = await this.streamService.findById(streamId);
                if (!stream) {
                    throw new MyError.NotFoundError("Stream not found");
                }

                if (stream.userId !== currentUser.id) {
                    throw new MyError.UnauthorizedError();
                }

                const stats = await this.orderService.getDonationStats(
                    streamId,
                    period,
                );

                return ApiResponse.WriteJSON({
                    c,
                    data: stats,
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
