import { SettingDTO } from "../dtos/setting.dto";
import { Utils } from "../lib/helpers/utils";
import { eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

export interface ISettingRepository
    extends Utils.AutoMappedClass<SettingRepository> {}

export class SettingRepository implements ISettingRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    public async createOne(data: SettingDTO.Insert) {
        try {
            const [setting] = await this.db
                .insert(tableSchemas.settingTable)
                .values(data)
                .returning();
            return setting;
        } catch (error) {}
    }
    public async upsertByStreamId(streamId: string, data: SettingDTO.Update) {
        try {
            const [updatedSetting] = await this.db
                .insert(tableSchemas.settingTable)
                .values({ ...data, streamId })
                .onConflictDoUpdate({
                    target: tableSchemas.settingTable.streamId,
                    set: data,
                })
                .returning();
            return updatedSetting;
        } catch (error) {}
    }
    public async getSettingByStreamId(streamId: string) {
        try {
            const setting = await this.db.query.settingTable.findFirst({
                where: eq(tableSchemas.settingTable.streamId, streamId),
            });
            return setting;
        } catch (error) {}
    }
}
