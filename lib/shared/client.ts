import { hc } from "hono/client";

import { envClient } from "@/lib/env/env.client";

import { type AppType } from "@/server/api";

export const client = hc<AppType>(envClient.NEXT_PUBLIC_APP_URL);

export const clientCookie = (cookies: string) => {
    const client = hc<AppType>(envClient.NEXT_PUBLIC_APP_URL, {
        headers: {
            Cookie: cookies,
        },
    });
    return client;
};
