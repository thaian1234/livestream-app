import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";
import { FilterType, PaginationType } from "@/lib/types";

import { CategoryRouteType } from "@/server/api/routes/category.routes";

const keys = {
    basic: (queryParams: PaginationType & FilterType) =>
        ["category-basic", queryParams] as string[],
    detail: (pagination: PaginationType) =>
        ["category-detail", pagination] as string[],
};
const baseApi = baseClient<CategoryRouteType>().categories;

export const categoryApi = {
    query: {
        useGetBasic(queryParams: PaginationType & FilterType) {
            const $get = baseApi.$get;
            return Fetcher.useHonoQuery($get, keys.basic(queryParams), {
                query: queryParams,
            });
        },
        useGetDetail(pagination: PaginationType) {
            const $get = baseApi.detail.$get;
            return Fetcher.useHonoQuery($get, keys.detail(pagination), {
                query: pagination,
            });
        },
    },
};
