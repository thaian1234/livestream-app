import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";

import { errorHandler } from "./lib/helpers/errors";
import type { Env } from "./lib/types/factory.type";

const app = new Hono<Env>().basePath("/api");

// Middleware
app.use(logger());
app.use("*", csrf());

// Error
app.onError(errorHandler);
app.notFound((c) => {
    // TODO: Handle not found
    return c.text("Api not found");
});

// Setup routes
const routes = app;

type AppType = typeof routes;

export { app, type AppType };
