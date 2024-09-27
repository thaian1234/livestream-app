import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    follow: ["follow"],
};

export const followApi = {
    query: {
        useFollow(page = "1", size = "4") {
            const $get = client.api.follows.follow.$get;
            return Fetcher.useHonoQuery($get, keys.follow, {
                query: {
                    page,
                    size,
                },
            });
        },
    },
    mutation: {},
};
