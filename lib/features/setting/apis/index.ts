import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { SettingRouteType } from "@/server/api/routes/setting.routes";

const keys = {
    settings: ["settings"],
};
const baseApi = baseClient<SettingRouteType>().settings;

export const settingApi = {
    query: {
        useGetSetting() {
            const $get = baseApi.$get;
            return Fetcher.useHonoSuspenseQuery($get, keys.settings, {}, {});
        },
    },
    mutation: {
        useUpdateKeySetting() {
            const $patch = baseApi["generate-key"].$patch;
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
        useUpdateSetting() {
            const $patch = baseApi.$patch;
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
