import { SQL, and, desc, eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { donateCardTable } from "../../db/schemas/donate-card.table";
import { DonateCardDTO } from "../dtos/donate-card.dto";

export interface IDonateCardRepository
    extends Utils.AutoMappedClass<DonateCardRepository> {}

export class DonateCardRepository implements IDonateCardRepository {
    private readonly db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async create(data: DonateCardDTO.Insert) {
        const [card] = await this.db
            .insert(donateCardTable)
            .values(data)
            .returning();
        return card;
    }

    async findById(id: string) {
        const [card] = await this.db
            .select()
            .from(donateCardTable)
            .where(eq(donateCardTable.id, id));
        return card;
    }

    async findByStreamId(streamId: string, includeInactive = false) {
        const filters: SQL[] = [eq(donateCardTable.streamId, streamId)];
        if (!includeInactive) {
            filters.push(eq(donateCardTable.isActive, true));
        }
        const data = await this.db.query.donateCardTable.findMany({
            where: and(...filters),
            orderBy: desc(donateCardTable.createdAt),
        });
        return data;
    }

    async update(id: string, data: DonateCardDTO.Update) {
        const [updated] = await this.db
            .update(donateCardTable)
            .set({ ...data, updatedAt: new Date().toISOString() })
            .where(eq(donateCardTable.id, id))
            .returning();
        return updated;
    }
    async delete(id: string) {
        const result = await this.db
            .delete(donateCardTable)
            .where(eq(donateCardTable.id, id))
            .returning({ id: donateCardTable.id });
        return result.length > 0;
    }

    async countActiveCard(streamId: string) {
        const totalRecords = await this.db.$count(
            tableSchemas.donateCardTable,
            and(eq(tableSchemas.donateCardTable.streamId, streamId)),
        );
        return totalRecords;
    }
}
