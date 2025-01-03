import { HttpStatus } from "../constant/http.type";
import { ApiResponse } from "../helpers/api-response";
import { AppError, MyError } from "../helpers/errors";
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
                status: HttpStatus.UnprocessableEntity,
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
                status: HttpStatus.UnprocessableEntity,
                msg: err.message,
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
            case err instanceof MyError.BadRequestError:
                return ApiResponse.WriteErrorJSON({
                    c,
                    status: (err as AppError).statusCode,
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
