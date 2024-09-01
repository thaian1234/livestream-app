import { InferResponseType } from "hono";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { cache } from "react";

import { client } from "@/server/api/client";

export const fetchUser = async () => {
    const $get = client.api.auth["verify-session"].$get;
    type RequestType = InferResponseType<typeof $get, 200>;
    const url = (await $get()).url;
    const allCookies = cookies().toString();
    const resp = await fetch(url, {
        method: "GET",
        headers: {
            Cookie: allCookies,
        },
    });
    if (!resp.ok) {
        const err = (await resp.json()).msg;
        throw new Error(err);
    }
    return (await resp.json()).data as RequestType;
};
