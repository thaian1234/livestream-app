import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    follow: (page: string, size: string) => ["follow", page, size],
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
    mutation: {},
};
