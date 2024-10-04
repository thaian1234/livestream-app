import { Fetcher } from "@/lib/helpers/fetcher";
import { client } from "@/lib/shared/client";

const keys = {
    stream: ["stream"],
    call: ["call"],
    myStream: ["my-stream"],
};

export const streamApi = {
    query: {
        useGetStreamToken() {
            const $get = client.api.streams["stream-token"].$get;
            return Fetcher.useHonoQuery(
                $get,
                keys.stream,
                {},
                {
                    retry: 1,
                },
            );
        },
    },
    mutation: {},
};
