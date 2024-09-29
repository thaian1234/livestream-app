import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

export const followApi = {
    mutation: {
        useFollowToggle() {
            const $post =
                client.api.follows[":followerId"][":followingId"].$post;
            const { mutation, toast } = Fetcher.useHonoMutation($post, {
                onSuccess() {
                    toast.success("Follow success");
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
            return mutation;
        },
    },
};
