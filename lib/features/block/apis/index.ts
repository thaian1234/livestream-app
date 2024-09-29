import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

export const blockApi = {
    mutation: {
        useBlockToggle() {
            const $post = client.api.blocks[":blockerId"][":blockedId"].$post;
            const { mutation, toast } = Fetcher.useHonoMutation($post, {
                onSuccess() {
                    toast.success("Block success");
                },
                onError(err) {
                    toast.error(err.message);
                },
            });
            return mutation;
        },
    },
};
