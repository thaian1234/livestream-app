import { hash, verify } from "@node-rs/argon2";

export namespace Utils {
    export type MethodReturnType<T, K extends keyof T> = T[K] extends (
        ...args: any[]
    ) => any
        ? ReturnType<T[K]>
        : never;
    type MethodsOf<T> = {
        [K in keyof T]: T[K] extends Function ? K : never;
    }[keyof T];

    export type AutoMappedClass<T, ExcludedMethods extends keyof T = never> = {
        [K in Exclude<MethodsOf<T>, ExcludedMethods>]: T[K] extends (
            ...args: infer P
        ) => any
            ? (...args: P) => Utils.MethodReturnType<T, K>
            : never;
    };
    export type PickMethods<T, K extends keyof T> = {
        [P in K]: T[P] extends (...args: infer A) => infer R
            ? (...args: A) => R
            : never;
    };

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
}
