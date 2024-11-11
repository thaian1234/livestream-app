import { SignJWT, jwtVerify } from "jose";

import { envServer } from "@/lib/env/env.server";

export class JWTUtils {
    private static secret = new TextEncoder().encode(
        envServer.GETSTREAM_PRIVATE_API_KEY,
    );

    public static async generateToken(payload: any, expiresIn: string = "24h") {
        return await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(expiresIn)
            .sign(this.secret);
    }

    public static async verifyToken(token: string) {
        try {
            const { payload } = await jwtVerify(token, this.secret);
            return payload;
        } catch {
            return null;
        }
    }

    public static async isTokenExpired(token: string): Promise<boolean> {
        const payload = await this.verifyToken(token);
        if (!payload) return true;

        const expTime = payload.exp;
        if (!expTime) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime >= expTime;
    }
}
