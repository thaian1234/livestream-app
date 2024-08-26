import { ApiResponse } from "../helpers/api-response";
import { MyError } from "../helpers/errors";
import { HttpStatus } from "../types/http.type";
import { Context } from "hono";
import { HTTPResponseError } from "hono/types";
import { ZodError } from "zod";

type ResultType<T> = {
    success: boolean;
    data: T;
    error?: ZodError;
};

export class Validator {
    public static handleParseError<T>(result: ResultType<T>, c: Context) {
        if (!result.success) {
            const zodErr = result.error
                ? result.error.flatten().fieldErrors
                : "Something went wrong";
            return ApiResponse.WriteErrorJSON({
                c,
                status: HttpStatus.BadRequest,
                msg: zodErr as string,
            });
        }
    }
    public static handleErrorException(
        err: Error | HTTPResponseError,
        c: Context,
    ) {
        if (err instanceof ZodError) {
            return ApiResponse.WriteErrorJSON({
                c,
                status: HttpStatus.BadRequest,
                msg: "Vaidated fail",
            });
        }
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
            case err instanceof MyError.GatewayTimeoutError:
                return ApiResponse.WriteErrorJSON({
                    c,
                    status: err.statusCode,
                    msg: err.message,
                });
            default:
                console.error("Failed to handle error: ", err);
                return ApiResponse.WriteErrorJSON({
                    c,
                    status: HttpStatus.InternalServerError,
                    msg: "Something went wrong",
                });
        }
    }
}
