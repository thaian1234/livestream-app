import { Fetcher } from "@/lib/helpers/fetcher";
import { useAuth } from "@/lib/providers/auth-provider";
import { client } from "@/lib/shared/client";

const keys = {
    follow: ["follow"],
};

export const followApi = {
    query: {
        useFollow(page = "1", size = "4") {
            const { user, isPending } = useAuth();
            const $get = client.api.follows[":userId"].follow.$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.follow,
                {
                    param: {
                        userId: user?.id || "",
                    },
                    query: {
                        page,
                        size,
                    },
                },
                {
                    enabled: !isPending,
                },
            );
        },
    },
    mutation: {},
};
