import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const envClient = createEnv({
    client: {
        NEXT_PUBLIC_APP_URL: z.string().url(),
        NEXT_PUBLIC_GETSTREAM_API_KEY: z.string().default("test_ci"),
        NEXT_PUBLIC_GETSTREAM_APP_ID: z.string().default("1340334"),
    },
    shared: {
        NODE_ENV: z
            .enum(["development", "production", "test"])
            .default("development"),
    },
    runtimeEnv: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_GETSTREAM_API_KEY:
            process.env.NEXT_PUBLIC_GETSTREAM_API_KEY,
        NEXT_PUBLIC_GETSTREAM_APP_ID: process.env.NEXT_PUBLIC_GETSTREAM_APP_ID,
    },
    skipValidation:
        !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
