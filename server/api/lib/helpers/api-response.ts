import { Context } from "hono";
import {
    ClientErrorStatusCode,
    ContentfulStatusCode,
    ServerErrorStatusCode,
    SuccessStatusCode,
} from "hono/utils/http-status";

export type HonoErrorStatusCode = ContentfulStatusCode &
    (ClientErrorStatusCode | ServerErrorStatusCode);

export type HonoSuccessStatusCode = ContentfulStatusCode & SuccessStatusCode;

type ApiResponseType<T> = {
    status: HonoSuccessStatusCode;
    data: T;
    c: Context;
    msg?: string;
};
type ApiErrorResponseType = {
    status: HonoErrorStatusCode;
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
