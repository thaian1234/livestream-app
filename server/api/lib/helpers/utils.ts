import { hash, verify } from "@node-rs/argon2";

export namespace Utils {
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
}
