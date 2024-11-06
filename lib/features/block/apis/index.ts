import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    block: (page: string, size: string) => ["block", page, size],
};

export const blockApi = {
    query: {
        useBlock(page = "1", size = "4") {
            const $get = client.api.blocks.blocked.$get;
            return Fetcher.useHonoQuery($get, keys.block(page, size), {
                query: {
                    page,
                    size,
                },
            });
        },
    },
    mutation: {
        useBlockToggle() {
            const $post = client.api.blocks[":blockedId"].$post;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $post,
                {
                    onSuccess(data) {
                        toast.success(data.msg);
                        queryClient.invalidateQueries({
                            queryKey: keys.block("1", "1000"),
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
