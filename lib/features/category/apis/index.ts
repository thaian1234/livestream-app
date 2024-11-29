import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    basic: (filterBy: string, page: string, size: string) => [
        "category-basic",
        filterBy,
        page,
        size,
    ],
    detail: (page: string, size: string) => ["category-detail", page, size],
};

export const categoryApi = {
    query: {
        useGetBasic(filterBy = "", page = "1", size = "5") {
            const $get = client.api.categorys.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.basic(filterBy, page, size),
                {
                    query: {
                        filterBy,
                        page,
                        size,
                    },
                },
            );
        },
        useGetDetail(page = "1", size = "12") {
            const $get = client.api.categorys.detail.$get;
            return Fetcher.useHonoQuery($get, keys.detail(page, size), {
                query: {
                    page,
                    size,
                },
            });
        },
    },
};
