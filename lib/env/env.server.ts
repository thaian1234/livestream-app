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
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),
        GOOGLE_API_URL: z.string().url(),
        CLOUDFLARE_BUCKET_NAME: z.string().min(1),
        CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
        CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),
        CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
        CLOUD_FLARE_BUCKET_URL: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        GITHUB_API_URL: z.string().url(),
        GETSTREAM_PRIVATE_API_KEY: z.string().default("test_ci"),
        GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    },
    shared: {
        NODE_ENV: z
            .enum(["development", "production", "test"])
            .default("development"),
    },
    runtimeEnv: {
        GETSTREAM_PRIVATE_API_KEY: process.env.GETSTREAM_PRIVATE_API_KEY,
        CLOUD_FLARE_BUCKET_URL: process.env.CLOUD_FLARE_BUCKET_URL,
        CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
        CLOUDFLARE_BUCKET_NAME: process.env.CLOUDFLARE_BUCKET_NAME,
        CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
        DB_HOST: process.env.DB_HOST,
        DB_NAME: process.env.DB_NAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_URL: process.env.DB_URL,
        GITHUB_API_URL: process.env.GITHUB_API_URL,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        GOOGLE_API_URL: process.env.GOOGLE_API_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        NODE_ENV: process.env.NODE_ENV,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    },
    skipValidation:
        !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
