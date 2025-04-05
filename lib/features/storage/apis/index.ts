import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";
import { PaginationType } from "@/lib/types";

import { StorageRouteType } from "@/server/api/routes/storage.routes";

const baseApi = baseClient<StorageRouteType>().storages;
const baseKey = ["storages"];

const keys = {
    storages: baseKey,
    video: (id: string) => [...baseKey, id] as string[],
    recordings: [...baseKey, "recordings"] as string[],
    stats: [...baseKey, "stats"] as string[],
};

export const storageApi = {
    query: {
        useGetRecordings(pagination: PaginationType) {
            const $get = baseApi.recordings.$get;
            return Fetcher.useHonoQuery($get, keys.recordings, {
                query: pagination,
            });
        },
        useGetStorageStats() {
            const $get = baseApi.stats.$get;
            return Fetcher.useHonoQuery($get, keys.stats);
        },
    },
    mutation: {
        useDeleteRecording() {
            const $delete = baseApi.recordings[":id"].$delete;
            const { mutation, queryClient, toast } = Fetcher.useHonoMutation(
                $delete,
                {
                    onSuccess({ msg }) {
                        queryClient.invalidateQueries({
                            queryKey: keys.recordings,
                        });
                        toast.success(msg);
                    },
                    onError({ message }) {
                        toast.error(message);
                    },
                },
            );
            return mutation;
        },
    },
};
