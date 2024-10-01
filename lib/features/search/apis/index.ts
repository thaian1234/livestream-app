import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    search: (page: string, size: string, filterBy: string) => [
        "search",
        page,
        size,
        filterBy,
    ],
};

export const searchApi = {
    query: {
        useSearch(page = "1", size = "10", filterBy = "") {
            const $get = client.api.search.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.search(page, size, filterBy),
                {
                    query: {
                        page,
                        size,
                        filterBy,
                    },
                },
                {
                    enabled: filterBy !== "",
                },
            );
        },
    },
    mutation: {},
};
