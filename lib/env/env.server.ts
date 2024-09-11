import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const envServer = createEnv({
    server: {
        DB_URL: z.string().url(),
        DB_NAME: z.string().min(1),
        DB_PASSWORD: z.string().min(1),
        DB_HOST: z.string().min(1),
        SMTP_HOST: z.string().min(1),
        SMTP_PORT: z.coerce.number().default(587),
        SMTP_USER: z.string().email(),
        SMTP_PASS: z.string().min(1),
    },
    shared: {
        NODE_ENV: z
            .enum(["development", "production", "test"])
            .default("development"),
    },
    experimental__runtimeEnv: process.env,
    skipValidation:
        !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
