import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const baseApi = client.api.storages;
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
