import { envClient } from "@/lib/env/env.client";

export class AppConfig {
    public static readonly BASE_PATH = "/api";
    public static readonly CORS_ORIGIN = envClient.NEXT_PUBLIC_APP_URL;
    public static readonly CORS_OPTIONS = {
        origin: AppConfig.CORS_ORIGIN,
        credentials: true,
        allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
        allowMethods: ["POST", "GET", "DELETE", "PATCH"],
        exposeHeaders: ["Content-Length", "X-CSRF-Token"],
        maxAge: 600,
    };
}
