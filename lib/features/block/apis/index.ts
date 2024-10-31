import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    block: (page: string, size: string) => ["follow", page, size],
};

export const blockApi = {
    query: {
        useBlock(page = "1", size = "4", userId: string) {
            const $get = client.api.blocks[":userId"].blocked.$get;
            return Fetcher.useHonoQuery($get, keys.block(page, size), {
                param: {
                    userId,
                },
                query: {
                    page,
                    size,
                },
            });
        },
    },
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
