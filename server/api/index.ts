import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";

import type { Env } from "./lib/types/factory.type";
import { Validator } from "./lib/validations/validator";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";

const app = new Hono<Env>().basePath("/api");

// Middleware
app.use(logger());
app.use("*", csrf());

// Error
app.onError(Validator.handleErrorException);
app.notFound((c) => {
    // TODO: Handle not found
    return c.text("Api not found");
});
// Setup routes
const routes = app.route("/", userRoutes).route("/", authRoutes);

type AppType = typeof routes;

export { type AppType };
export default app;
