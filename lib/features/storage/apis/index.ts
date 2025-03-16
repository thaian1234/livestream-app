import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { StorageRouteType } from "@/server/api/routes/storage.routes";

const baseApi = baseClient<StorageRouteType>().storages;
const baseKey = ["storages"];

const keys = {
    storages: baseKey,
    video: (id: string) => [...baseKey, id],
    recordings: [...baseKey, "recordings"],
};

export const storageApi = {
    query: {
        useGetRecordings() {
            const $get = baseApi.recordings.$get;
            return Fetcher.useHonoQuery($get, keys.recordings, {});
        },
    },
    mutation: {},
};
