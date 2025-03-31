import { zValidator } from "@hono/zod-validator";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
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
            .get("/recordings", ...this.getAllReccordings());
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
                    data: {
                        recordings: respSchema.parse(storages),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
