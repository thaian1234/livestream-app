import Database from "@/server/db";

export class BaseRepository {
    protected readonly db = Database.getInstance().db;
}
