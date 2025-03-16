import { Fetcher } from "@/lib/helpers/fetcher";
import { baseClient } from "@/lib/shared/client";

import { BlockRouteType } from "@/server/api/routes/block.routes";

const keys = {
    block: (page: string, size: string) => ["block", page, size],
};
const baseApi = baseClient<BlockRouteType>().blocks;

export const blockApi = {
    query: {
        useBlock(page = "1", size = "4") {
            const $get = baseApi.blocked.$get;
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
            const $post = baseApi[":blockedId"].$post;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $post,
                {
                    onSuccess(data) {
                        toast.success(data.msg);
                        queryClient.invalidateQueries({
                            queryKey: ["block"],
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
