import { QueryDTO } from "../dtos/query.dto";
import { StreamDTO } from "../dtos/stream.dto";
import { UserDTO } from "../dtos/user.dto";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import PaginationHelper from "../lib/helpers/pagination";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { IStreamService } from "../services/stream.service";
import { IUserService } from "../services/user.service";
import { zValidator } from "@hono/zod-validator";

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
        const queries = QueryDTO.createAdvancedSchemaWithCategory();
        return this.factory.createHandlers(
            zValidator("query", queries, Validator.handleParseError),
            async (c) => {
                const currentUser = c.get("user");
                const queries = c.req.valid("query");

                const isFilterWithCategory = queries?.categoryIds.length > 0;

                const users = !isFilterWithCategory
                    ? await this.userService.advancedSearchUser(
                          queries,
                          currentUser ? currentUser.id : null,
                      )
                    : null;
                const streams =
                    await this.streamService.advancedSearchStream(queries);
                const formattedStreams = streams.result.map((stream) => {
                    const categories = stream.streamsToCategories.map(
                        (streamToCategory) => {
                            return streamToCategory.category;
                        },
                    );
                    return {
                        ...stream,
                        categories,
                    };
                });
                const totalRecords = isFilterWithCategory
                    ? streams.totalRecords
                    : Math.max(streams.totalRecords, users?.totalRecords || 0);

                return ApiResponse.WriteJSON({
                    c,
                    data: PaginationHelper.getPaginationMetadata({
                        data: {
                            users:
                                users && UserDTO.parseManySearch(users.result),
                            streams:
                                StreamDTO.parseManySearch(formattedStreams),
                        },
                        currentOffset: queries.size * (queries.page - 1),
                        limit: queries.size,
                        totalRecords: totalRecords,
                    }),
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
