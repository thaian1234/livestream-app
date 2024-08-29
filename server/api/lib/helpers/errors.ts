import { HttpStatus } from "../constant/http.type";
import { StatusCode, SuccessStatusCode } from "hono/utils/http-status";

class AppError extends Error {
    constructor(
        public statusCode: Exclude<StatusCode, SuccessStatusCode>,
        message: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

class ErrorFactory {
    static createError(
        defaultMessage: string,
        statusCode: Exclude<StatusCode, SuccessStatusCode>,
    ) {
        return class extends AppError {
            constructor(message: string = defaultMessage) {
                super(statusCode, message);
            }
        };
    }
}

export class MyError {
    static UnauthenticatedError = ErrorFactory.createError(
        "Authentication required",
        HttpStatus.Unauthorized,
    );
    static UnauthorizedError = ErrorFactory.createError(
        "You are not authorized to perform this action",
        HttpStatus.Forbidden,
    );
    static NotFoundError = ErrorFactory.createError(
        "Resource not found",
        HttpStatus.NotFound,
    );
    static ValidationError = ErrorFactory.createError(
        "Validation failed",
        HttpStatus.BadRequest,
    );
    static BadRequestError = ErrorFactory.createError(
        "Bad request",
        HttpStatus.BadRequest,
    );
    static ConflictError = ErrorFactory.createError(
        "Conflict with existing resource",
        HttpStatus.Conflict,
    );
    static InternalServerError = ErrorFactory.createError(
        "Internal server error",
        HttpStatus.InternalServerError,
    );
    static BadGatewayError = ErrorFactory.createError(
        "Bad gateway",
        HttpStatus.BadGateway,
    );
    static ServiceUnavailableError = ErrorFactory.createError(
        "Service unavailable",
        HttpStatus.ServiceUnavailable,
    );
    static GatewayTimeoutError = ErrorFactory.createError(
        "Gateway timeout",
        HttpStatus.GatewayTimeout,
    );
    static TooManyRequestsError = ErrorFactory.createError(
        "Too many requests",
        HttpStatus.TooManyRequests,
    );
}
