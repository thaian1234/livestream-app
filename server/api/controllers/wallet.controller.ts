import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { IWalletService } from "../services/wallet.service";

import { QueryDTO } from "../dtos/query.dto";

export interface IWalletController
    extends Utils.AutoMappedClass<WalletController> {}

export class WalletController implements IWalletController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly walletService: IWalletService,
    ) {}

    setupHandlers() {
        return this.factory
            .createApp()
            .get("/", ...this.getMyWalletHandler())
            .get("/transactions", ...this.getTransactionsHandler())
            .get("/recent", ...this.getWalletWithRecentTransactionsHandler());
    }

    private getMyWalletHandler() {
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");

                const wallet = await this.walletService.getWalletByUserId(
                    currentUser.id,
                );

                return ApiResponse.WriteJSON({
                    c,
                    data: wallet,
                    status: HttpStatus.OK,
                    msg: "Wallet retrieved successfully",
                });
            },
        );
    }

    private getTransactionsHandler() {
        const querySchema = QueryDTO.createPaginationSchema(1, 10);

        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            zValidator("query", querySchema, Validator.handleParseError),
            async (c) => {
                const currentUser = c.get("getUser");
                const { page, size } = c.req.valid("query");

                const wallet = await this.walletService.getWalletByUserId(
                    currentUser.id,
                );
                const transactions =
                    await this.walletService.getTransactionHistory(
                        wallet.id,
                        page,
                        size,
                    );

                return ApiResponse.WriteJSON({
                    c,
                    data: transactions,
                    status: HttpStatus.OK,
                    msg: "Transactions retrieved successfully",
                });
            },
        );
    }

    private getWalletWithRecentTransactionsHandler() {
        const querySchema = z.object({
            limit: z.string().optional().default("3").transform(Number),
        });

        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            zValidator("query", querySchema, Validator.handleParseError),
            async (c) => {
                const currentUser = c.get("getUser");
                const { limit } = c.req.valid("query");

                const result =
                    await this.walletService.getWalletWithRecentTransactions(
                        currentUser.id,
                        limit,
                    );

                return ApiResponse.WriteJSON({
                    c,
                    data: result,
                    status: HttpStatus.OK,
                    msg: "Wallet with recent transactions retrieved successfully",
                });
            },
        );
    }
}
