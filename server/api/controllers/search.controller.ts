import { QueryDTO } from "../dtos/query.dto";
import { StreamDTO } from "../dtos/stream.dto";
import { UserDTO } from "../dtos/user.dto";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
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
                const {
                    page,
                    size,
                    dateFrom,
                    dateTo,
                    filterBy,
                    isSortByCreatedAt,
                    sortOrder,
                } = c.req.valid("query");
                const users = await this.userService.advancedSearchUser(
                    filterBy,
                    dateFrom,
                    dateTo,
                    isSortByCreatedAt,
                    sortOrder,
                    (page - 1) * size,
                    size,
                );
                const streams = await this.streamService.advancedSearchStream(
                    filterBy,
                    dateFrom,
                    dateTo,
                    isSortByCreatedAt,
                    sortOrder,
                    (page - 1) * size,
                    size,
                );
                return ApiResponse.WriteJSON({
                    c,
                    data: {
                        users: UserDTO.parseMany(users),
                        streams: StreamDTO.parseMany(streams),
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
