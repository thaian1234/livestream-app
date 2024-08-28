import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";

import type { Env } from "./lib/types/factory.type";
import { Validator } from "./lib/validations/validator";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";

const app = new Hono<Env>().basePath("/api");

// Middleware
app.use(logger());
// app.use(csrf());
app.use(
    "*",
    cors({
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        credentials: true,
        allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
        allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH"],
        exposeHeaders: ["Content-Length", "X-CSRF-Token"],
        maxAge: 600,
    }),
);
app.use("*", AuthMiddleware.init);

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
