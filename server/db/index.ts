import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { envServer } from "@/lib/env/env.server";

import { CustomAdapter } from "../api/configs/adapter.config";
import tableSchemas, { tableRelations } from "./schemas";

class Database {
    private static instance: Database;
    public db;
    public adapter: CustomAdapter;
    public constructor() {
        const pool = new Pool({
            connectionString: envServer.DB_URL,
            max: 20, // Maximum number of clients in the pool
            idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
            connectionTimeoutMillis: 2000, // How long to wait for a connection
            query_timeout: 10000, // Query timeout in milliseconds
            statement_timeout: 10000, // Statement timeout in milliseconds
            lock_timeout: 10000, // Lock timeout in milliseconds
            ssl: false,
        });
        this.db = drizzle({
            schema: {
                ...tableSchemas,
                ...tableRelations,
            },
            casing: "snake_case",
            client: pool,
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
