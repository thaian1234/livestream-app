import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    follow: (page: string, size: string) => ["follow", page, size],
    stream_information: ["stream_information"],
};

export const followApi = {
    query: {
        useFollow(page = "1", size = "4") {
            const $get = client.api.follows.follow.$get;
            return Fetcher.useHonoQuery($get, keys.follow(page, size), {
                query: {
                    page,
                    size,
                },
            });
        },
    },
    mutation: {
        useFollowToggle() {
            const $post = client.api.follows[":followingId"].$post;
            const { mutation, toast, queryClient } = Fetcher.useHonoMutation(
                $post,
                {
                    onError(err) {
                        toast.error(err.message);
                    },
                    onSuccess(data, variables) {
                        toast.success(data.msg);
                        queryClient.invalidateQueries({
                            queryKey: keys.stream_information,
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["follow"],
                        });
                    },
                },
            );
            return mutation;
        },
    },
};
