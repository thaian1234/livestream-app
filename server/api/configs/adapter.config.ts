import {
    DrizzlePostgreSQLAdapter,
    PostgreSQLSessionTable,
    PostgreSQLUserTable,
} from "@lucia-auth/adapter-drizzle";
import { InferSelectModel, eq } from "drizzle-orm";
import { DatabaseSession, DatabaseUser } from "lucia";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

export class CustomAdapter extends DrizzlePostgreSQLAdapter {
    public async getSessionAndUser(
        sessionId: string,
    ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
        const db = Database.getInstance().db;
        const session = await db.query.sessionTable.findFirst({
            where: eq(tableSchemas.sessionTable.id, sessionId),
            with: {
                user: {
                    with: {
                        accounts: true,
                        stream: true,
                    },
                },
            },
        });
        if (!session || !session.user) {
            return [null, null];
        }
        return [
            transformIntoDatabaseSession(session),
            transformIntoDatabaseUser(session.user),
        ];
    }
}

function transformIntoDatabaseSession(
    raw: InferSelectModel<PostgreSQLSessionTable>,
): DatabaseSession {
    const { id, userId, expiresAt, ...attributes } = raw;
    return {
        userId,
        id,
        expiresAt,
        attributes,
    };
}

function transformIntoDatabaseUser(
    raw: InferSelectModel<PostgreSQLUserTable>,
): DatabaseUser {
    const { id, ...attributes } = raw;
    return {
        id,
        // @ts-ignore
        attributes,
    };
}
