import { HttpStatus } from "../types/http.type";
import { hash, verify } from "@node-rs/argon2";
import { Context } from "hono";
import { ZodError } from "zod";

import { ApiResponse } from "./api-response";

export type MethodReturnType<T, K extends keyof T> = T[K] extends (
    ...args: any[]
) => any
    ? ReturnType<T[K]>
    : never;

export class PasswordUtils {
    public static async verifyHash(hash: string, password: string) {
        const success = await verify(hash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });
        return success;
    }
    public static async hashPassword(password: string) {
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });
        return passwordHash;
    }
}

type ResultType<T> = {
    success: boolean;
    data: T;
    error?: ZodError;
};

export class Validator {
    public static validatorHandler<T>(result: ResultType<T>, c: Context) {
        if (!result.success) {
            const zodErr = result.error
                ? result?.error.flatten().fieldErrors
                : "Something went wrong";
            return ApiResponse.WriteJSON({
                c,
                status: HttpStatus.BadRequest,
                errors: zodErr,
            });
        }
    }
}
