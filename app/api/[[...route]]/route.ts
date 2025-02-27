import { handle } from "hono/vercel";

import app from "@/server/api";

export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
