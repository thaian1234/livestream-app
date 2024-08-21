import { HttpStatus } from "../types/http.type";
import { Context } from "hono";
import { HTTPResponseError } from "hono/types";
import { StatusCode } from "hono/utils/http-status";

import { ApiResponse } from "./api-response";

class AppError extends Error {
    constructor(
        public statusCode: StatusCode,
        message: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

class ErrorFactory {
    static createError(defaultMessage: string, statusCode: StatusCode) {
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

export const errorHandler = (err: Error | HTTPResponseError, c: Context) => {
    switch (true) {
        case err instanceof MyError.UnauthenticatedError:
        case err instanceof MyError.UnauthorizedError:
        case err instanceof MyError.NotFoundError:
        case err instanceof MyError.ValidationError:
        case err instanceof MyError.ConflictError:
        case err instanceof MyError.BadGatewayError:
        case err instanceof MyError.InternalServerError:
        case err instanceof MyError.TooManyRequestsError:
        case err instanceof MyError.ServiceUnavailableError:
            return ApiResponse.WriteJSON({
                c,
                status: err.statusCode,
                errors: err.message,
            });

        default:
            console.error("Error failed to handle: ", err);
            return ApiResponse.WriteJSON({
                c,
                status: HttpStatus.InternalServerError,
                errors: err.message,
            });
    }
};
