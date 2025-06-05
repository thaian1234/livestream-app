import { Lucia, TimeSpan } from "lucia";

import { envServer } from "@/lib/env/env.server";

import Database from "@/server/db";

import { Utils } from "../lib/helpers/utils";

import { UserDTO } from "../dtos/user.dto";

export interface ILuciaService extends Utils.AutoMappedClass<LuciaService> {}

export class LuciaService implements ILuciaService {
    private static instance: LuciaService;
    private lucia;
    constructor() {
        const db = Database.getInstance();
        this.lucia = new Lucia(db.adapter, {
            sessionExpiresIn: new TimeSpan(2, "w"),
            sessionCookie: {
                expires: true,
                attributes: {
                    secure: envServer.NODE_ENV === "production",
                },
            },
            getUserAttributes(attributes) {
                return attributes;
            },
        });
    }
    public static getInstance() {
        if (!LuciaService.instance) {
            LuciaService.instance = new LuciaService();
        }
        return LuciaService.instance.lucia;
    }
    public async initiateSession(userId: string) {
        const session = await this.lucia.createSession(userId, {});
        const sessionCookie = this.lucia.createSessionCookie(session.id);
        return { session, sessionCookie };
    }
    public async revokeSession(sessionId: string) {
        return this.lucia.invalidateSession(sessionId);
    }
    public getSessionCookieName() {
        return this.lucia.sessionCookieName;
    }
}

declare module "lucia" {
    interface Register {
        Lucia: ReturnType<typeof LuciaService.getInstance>;
        DatabaseUserAttributes: UserDTO.UserWithAccountsAndStream;
    }
}
