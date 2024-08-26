import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

type ApiResponseType<T> = {
    status: StatusCode;
    data?: T;
    c: Context;
    msg?: string;
};
type ApiErrorResponseType = {
    status: StatusCode;
    c: Context;
    msg?: string;
};

export class ApiResponse {
    public static WriteJSON<T>({ c, data, status, msg }: ApiResponseType<T>) {
        return c.json(
            {
                status,
                data,
                msg,
            },
            status,
        );
    }
    public static WriteErrorJSON({ c, status, msg }: ApiErrorResponseType) {
        return c.json(
            {
                status,
                msg,
            },
            status,
        );
    }
}
