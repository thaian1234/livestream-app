import { UserValidation } from "../validations/schema.validation";
import { Lucia, TimeSpan } from "lucia";

import Database from "@/server/db";

const db = Database.getInstance();

export const lucia = new Lucia(db.adapter, {
    sessionExpiresIn: new TimeSpan(2, "w"),
    sessionCookie: {
        expires: true,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes(attributes) {
        return {
            id: attributes.id,
            username: attributes.username,
            email: attributes.email,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: UserValidation.Select;
    }
}
