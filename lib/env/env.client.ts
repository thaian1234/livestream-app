import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const envClient = createEnv({
    client: {
        NEXT_PUBLIC_APP_URL: z.string().url(),
    },
    shared: {
        NODE_ENV: z
            .enum(["development", "production", "test"])
            .default("development"),
    },
    runtimeEnv: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NODE_ENV: process.env.NODE_ENV,
    },
    skipValidation:
        !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
