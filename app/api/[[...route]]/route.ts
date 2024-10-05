import { config } from "dotenv";
import { handle } from "hono/vercel";

import app from "@/server/api";

config({
    path: ".env",
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
