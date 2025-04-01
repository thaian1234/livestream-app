import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import PaginationHelper from "../lib/helpers/pagination";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { IStorageService } from "../services/storage.service";

import { QueryDTO } from "../dtos/query.dto";
import { StorageDTO } from "../dtos/storage.dto";

export interface IStorageController
    extends Utils.PickMethods<StorageController, "setupHandlers"> {}
export class StorageController implements IStorageController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly storageService: IStorageService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .use(AuthMiddleware.isAuthenticated)
            .get("/recordings", ...this.getAllReccordings())
            .delete("/recordings/:id", ...this.deleteAssetById());
    }

    private getAllReccordings() {
        const respSchema = StorageDTO.selectSchema.array();
        const queries = QueryDTO.createPaginationSchema(1, 5);

        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const pagination = c.req.valid("query");
                const user = c.get("getUser");
                const storages = await this.storageService.getAssetsByStreamId(
                    user.stream.id,
                    pagination,
                );

                if (!storages) {
                    throw new MyError.NotFoundError("No recordings found");
                }

                return ApiResponse.WriteJSON({
                    c,
                    data: PaginationHelper.getPaginationMetadata({
                        currentOffset: pagination.page,
                        totalRecords: storages.totalRecords,
                        limit: pagination.size,
                        data: respSchema.parse(storages.assets),
                    }),
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private deleteAssetById() {
        const params = z.object({
            id: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const params = c.req.valid("param");
                const user = c.get("getUser");
                const storage = await this.storageService.getAssetById(
                    params.id,
                );
                if (!storage) {
                    throw new MyError.NotFoundError("Storage not found");
                }
                if (storage.streamId !== user.stream.id) {
                    throw new MyError.UnauthorizedError(
                        "You are not allowed to delete this storage",
                    );
                }
                await this.storageService.deleteAsset(params.id);
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Storage deleted successfully",
                    status: HttpStatus.OK,
                    data: undefined,
                });
            },
        );
    }
}
