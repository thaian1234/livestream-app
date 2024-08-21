import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

type ApiResponseType = {
    status?: StatusCode | undefined;
    data?: unknown;
    c: Context;
    msg?: string;
    errors?: unknown;
};

export class ApiResponse {
    public static WriteJSON({ c, data, status, msg, errors }: ApiResponseType) {
        return c.json(
            {
                status,
                data,
                msg,
                errors,
            },
            status,
        );
    }
}
