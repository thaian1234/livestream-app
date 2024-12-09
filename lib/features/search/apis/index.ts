import { keepPreviousData } from "@tanstack/react-query";

import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

import { QueryDTO } from "@/server/api/dtos/query.dto";

const keys = {
    search: (query: QueryDTO.AdvancedWithCategory) =>
        ["search", query] as string[],
};

export const searchApi = {
    query: {
        useSearch(query: QueryDTO.AdvancedWithCategory) {
            const $get = client.api.search.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.search(query),
                {
                    query: {
                        filterBy: query.filterBy || "",
                        page: query.page?.toString(),
                        size: query.size?.toString(),
                        categoryIds:
                            query.categoryIds?.length > 0
                                ? query.categoryIds.join(",")
                                : undefined,
                    },
                },
                {
                    enabled: !!query.filterBy,
                    placeholderData: keepPreviousData,
                },
            );
        },
    },
    mutation: {},
};
