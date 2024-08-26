import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { config } from "dotenv";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import tableSchemas from "./schemas";

config({
    path: ".env",
});

class Database {
    private static instance: Database;
    public db: PostgresJsDatabase<typeof tableSchemas>;
    public adapter: DrizzlePostgreSQLAdapter;

    private constructor() {
        const sql = postgres(process.env.DB_URL!);
        this.db = drizzle(sql, { schema: tableSchemas });
        this.adapter = new DrizzlePostgreSQLAdapter(
            this.db,
            tableSchemas.sessionTable,
            tableSchemas.userTable,
        );
        Database.instance = this;
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
export default Database;