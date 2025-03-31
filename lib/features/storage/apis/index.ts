import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";
import { PaginationType } from "@/lib/types";

import { StorageRouteType } from "@/server/api/routes/storage.routes";

import { QueryDTO } from "@/server/api/dtos/query.dto";

const baseApi = baseClient<StorageRouteType>().storages;
const baseKey = ["storages"];

const keys = {
    storages: baseKey,
    video: (id: string) => [...baseKey, id],
    recordings: [...baseKey, "recordings"],
};

export const storageApi = {
    query: {
        useGetRecordings(pagination: PaginationType) {
            const $get = baseApi.recordings.$get;
            return Fetcher.useHonoQuery($get, keys.recordings, {
                query: pagination,
            });
        },
    },
    mutation: {},
};
