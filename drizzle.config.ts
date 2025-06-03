import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
    path: ".env",
});

export default defineConfig({
    schema: "./server/db/schemas/*.table.ts",
    out: "./server/db/migrations",
    dialect: "postgresql",
    verbose: true,
    strict: true,
    dbCredentials: {
        password: process.env.DB_PASSWORD || "",
        user: process.env.DB_USER || "",
        port: 5432,
        host: process.env.DB_HOST || "localhost",
        url: process.env.DB_URL || "",
        ssl: { rejectUnauthorized: false },
    },
    casing: "snake_case",
});
