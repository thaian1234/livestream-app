import { useQueryClient } from "@tanstack/react-query";

import { Fetcher } from "@/lib/helpers/fetcher";

import { client } from "@/server/api/client";

const keys = {
    users: ["users"],
};

export const users = {
    useGetAllUser() {
        const $get = client.api.users.$get;
        const fetcher = Fetcher.useHonoQuery($get, keys.users);
        return fetcher;
    },
    useUpdateUserById() {
        const queryClient = useQueryClient();
        const $patch = client.api.users[":id"].$patch;
        return Fetcher.useHonoMutation($patch, {
            onSuccess(data) {
                console.log("User updated");
                queryClient.invalidateQueries({
                    queryKey: keys.users,
                });
            },
            onError(err) {
                console.log(err.message);
            },
        });
    },
};
