import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import {
    BlockValidation,
    QueryValidation,
} from "../lib/validations/schema.validation";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { IBlockService } from "../services/block.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export interface IBlockController
    extends Utils.PickMethods<BlockController, "setupHandlers"> {}

export class BlockController implements IBlockController {
    constructor(
        private factory: CreateFactoryType,
        private blockService: IBlockService,
    ) {}
    setupHandlers() {
        return this.factory
            .createApp()
            .get("/:userId/blocked", ...this.getAllBlockedByUserIdHandler())
            .post("/:blockerId/:blockedId", ...this.blockToggle())
            .get("/:userId/blocked", ...this.findBlockedByUsernameOrEmail());
    }
    private getAllBlockedByUserIdHandler() {
        const params = z.object({
            userId: z.string().uuid(),
        });
        const queries = QueryValidation.createPaginationSchema();
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator("query", queries, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { userId } = c.req.valid("param");
                const { page, size } = c.req.valid("query");
                const currentUser = c.get("getUser");

                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const blockeds = await this.blockService.findBlockedByUserId(
                    userId,
                    (page - 1) * size,
                    size,
                );
                if (!blockeds) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch blocking",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: BlockValidation.parseMany(blockeds),
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private blockToggle() {
        const params = z.object({
            blockerId: z.string().uuid(),
            blockedId: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { blockerId, blockedId } = c.req.valid("param");
                const currentUser = c.get("getUser");
                if (currentUser.id !== blockerId) {
                    throw new MyError.UnauthorizedError();
                }
                if (currentUser.id === blockedId) {
                    throw new MyError.BadRequestError();
                }

                const data = await this.blockService.blockToggle({
                    blockerId,
                    blockedId,
                });

                return ApiResponse.WriteJSON({
                    c,
                    data: data,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private findBlockedByUsernameOrEmail() {
        const params = z.object({
            userId: z.string().uuid(),
        });
        const queries = QueryValidation.createFilterSchema();
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator("query", queries, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const { userId } = c.req.valid("param");
                const { page, size, filterBy } = c.req.valid("query");

                const currentUser = c.get("getUser");

                if (currentUser.id !== userId) {
                    throw new MyError.UnauthorizedError();
                }
                const blockedQuery =
                    await this.blockService.findBlockedByEmailOrUsername(
                        filterBy,
                        userId,
                        (page - 1) * size,
                        size,
                    );
                if (!blockedQuery) {
                    throw new MyError.BadRequestError(
                        "Failed to fetch blocked",
                    );
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: BlockValidation.parseMany(blockedQuery),
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
