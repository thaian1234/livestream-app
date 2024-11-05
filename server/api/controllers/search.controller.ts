import { QueryDTO } from "../dtos/query.dto";
import { StreamDTO } from "../dtos/stream.dto";
import { UserDTO } from "../dtos/user.dto";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import PaginationHelper from "../lib/helpers/pagination";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { IStreamService } from "../services/stream.service";
import { IUserService } from "../services/user.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export interface ISearchController
    extends Utils.PickMethods<SearchController, "setupHandlers"> {}

export class SearchController implements ISearchController {
    constructor(
        private factory: CreateFactoryType,
        private userService: IUserService,
        private streamService: IStreamService,
    ) {}
    setupHandlers() {
        return this.factory.createApp().get("/", ...this.search());
    }
    private search() {
        const queries = QueryDTO.createAdvancedSchema();
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const currentUser = c.get("user");
                const {
                    page,
                    size,
                    dateFrom,
                    dateTo,
                    filterBy,
                    isSortByCreatedAt,
                    sortOrder,
                } = c.req.valid("query");

                const offset = (page - 1) * size;

                const users = await this.userService.advancedSearchUser(
                    filterBy,
                    dateFrom,
                    dateTo,
                    isSortByCreatedAt,
                    sortOrder,
                    offset,
                    size,
                    currentUser ? currentUser.id : null,
                );
                const streams = await this.streamService.advancedSearchStream(
                    filterBy,
                    dateFrom,
                    dateTo,
                    isSortByCreatedAt,
                    sortOrder,
                    offset,
                    size,
                );
                console.log(streams)
                return ApiResponse.WriteJSON({
                    c,
                    data: PaginationHelper.getPaginationMetadata({
                        data: {
                            users: UserDTO.parseManySearch(users.result),
                            streams: StreamDTO.parseManySearch(streams.result),
                        },
                        currentOffset: offset,
                        limit: size,
                        totalRecords: Math.max(streams.totalRecords, users.totalRecords),
                    }),
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
