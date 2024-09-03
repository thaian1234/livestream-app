export class AppConfig {
    public static readonly BASE_PATH = "/api";
    public static readonly CORS_ORIGIN =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    public static readonly CORS_OPTIONS = {
        origin: AppConfig.CORS_ORIGIN,
        credentials: true,
        allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
        allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH"],
        exposeHeaders: ["Content-Length", "X-CSRF-Token"],
        maxAge: 600,
    };
}
