import { hc } from "hono/client";
import { init } from "next/dist/compiled/webpack/webpack";
import { set } from "zod";

import { envClient } from "@/lib/env/env.client";

import { type AppType } from "@/server/api";

export const client = hc<AppType>(envClient.NEXT_PUBLIC_APP_URL);

export const clientCookie = (cookies: string) => {
    const client = hc<AppType>(envClient.NEXT_PUBLIC_APP_URL, {
        fetch(input, requestInit, Env, executionCtx) {
            const headers = new Headers(requestInit?.headers);
            headers.set("Cookie", cookies);
            return fetch(input, { ...requestInit, headers });
        },
    });
    return client;
};
