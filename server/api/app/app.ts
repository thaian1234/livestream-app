import { AppConfig } from "../configs/app.config";
import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { Env } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { authRoutes } from "../routes/auth.routes";
import { followRoutes } from "../routes/follow.routes";
import { userRoutes } from "../routes/user.routes";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { uploadRoutes } from "../routes/upload.routes";

export class App {
    private app: Hono;

    constructor() {
        this.app = new Hono();
        this.setupMiddleware();
        this.setupErrorHandling();
        this.setupRoutes();
    }

    private setupMiddleware(): void {
        this.app.use(logger());
        this.app.use(csrf());
        this.app.use("*", cors(AppConfig.CORS_OPTIONS));
        this.app.use("*", AuthMiddleware.init);
    }

    private setupErrorHandling(): void {
        this.app.onError(Validator.handleErrorException);
        this.app.notFound((c) =>
            ApiResponse.WriteErrorJSON({
                c,
                status: HttpStatus.NotFound,
                msg: "API not found",
            }),
        );
    }

    public setupRoutes() {
        return this.app
            .basePath(AppConfig.BASE_PATH)
            .route("/", userRoutes)
            .route("/", followRoutes)
            .route("/", authRoutes)
            .route("/", uploadRoutes);
    }

    public getApp() {
        return this.app;
    }
}
