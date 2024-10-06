import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    settings: ["settings"],
};

export const settingApi = {
    query: {
        useGetSetting() {
            const $get = client.api.settings.$get;
            return Fetcher.useHonoSuspenseQuery($get, keys.settings, {}, {});
        },
    },
    mutation: {
        useUpdateSetting() {
            const $patch = client.api.settings["generate-key"].$patch;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $patch,
                {
                    onSuccess({ msg }) {
                        toast.success(msg);
                        queryClient.invalidateQueries({
                            queryKey: keys.settings,
                        });
                    },
                    onError(err) {
                        toast.error(err.message);
                    },
                },
            );
            return mutation;
        },
    },
};
