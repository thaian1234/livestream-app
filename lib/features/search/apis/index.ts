import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

import { QueryDTO } from "@/server/api/dtos/query.dto";

const keys = {
    search: (query: QueryDTO.Filter) => ["search", query] as string[],
};

export const searchApi = {
    query: {
        useSearch(query: QueryDTO.Filter) {
            const $get = client.api.search.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.search(query),
                {
                    query: {
                        filterBy: query.filterBy || "",
                        page: query.page?.toString(),
                        size: query.size?.toString(),
                    },
                },
                {
                    enabled: !!query.filterBy,
                },
            );
        },
    },
    mutation: {},
};
