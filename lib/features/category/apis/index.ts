import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";
import { FilterType, PaginationType } from "@/lib/types";

const keys = {
    basic: (queryParams: PaginationType & FilterType) =>
        ["category-basic", queryParams] as string[],
    detail: (pagination: PaginationType) =>
        ["category-detail", pagination] as string[],
};

export const categoryApi = {
    query: {
        useGetBasic(queryParams: PaginationType & FilterType) {
            const $get = client.api.categorys.$get;
            return Fetcher.useHonoQuery($get, keys.basic(queryParams), {
                query: queryParams,
            });
        },
        useGetDetail(pagination: PaginationType) {
            const $get = client.api.categorys.detail.$get;
            return Fetcher.useHonoQuery($get, keys.detail(pagination), {
                query: pagination,
            });
        },
    },
};
