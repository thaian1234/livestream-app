import { drizzle } from "drizzle-orm/postgres-js";

import { envServer } from "@/lib/env/env.server";

import { CustomAdapter } from "../api/configs/adapter.config";
import tableSchemas, { tableRelations } from "./schemas";

class Database {
    private static instance: Database;
    public db;
    public adapter: CustomAdapter;
    public constructor() {
        this.db = drizzle({
            connection: envServer.DB_URL,
            schema: {
                ...tableSchemas,
                ...tableRelations,
            },
            casing: "snake_case",
        });
        this.adapter = new CustomAdapter(
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
