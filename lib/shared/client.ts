import { Hono } from "hono";
import { hc } from "hono/client";

import { envClient } from "@/lib/env/env.client";

export function baseClient<T extends Hono<any, any, any>>(cookies?: string) {
    return hc<T>(`${envClient.NEXT_PUBLIC_APP_URL}/api`, {
        headers: {
            Cookie: cookies ?? "",
            "Content-Type": "application/json",
        },
    });
}
