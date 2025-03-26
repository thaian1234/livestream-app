import { and, asc, eq } from "drizzle-orm";

import Database from "@/server/db";
import tableSchemas from "@/server/db/schemas";

import { Utils } from "../lib/helpers/utils";

import { EventDTO } from "../dtos/event.dto";

export interface IEventRepository
    extends Utils.AutoMappedClass<EventRepository> {}

export class EventRepository implements IEventRepository {
    private db;
    constructor() {
        this.db = Database.getInstance().db;
    }
    async findById(id: string) {
        try {
            const event = await this.db.query.eventTable.findFirst({
                where: eq(tableSchemas.eventTable.id, id),
            });
            return event;
        } catch (error) {
            console.error(error);
        }
    }
    async findAllByUserId(userId: string) {
        try {
            const events = await this.db.query.eventTable.findMany({
                where: and(eq(tableSchemas.eventTable.userId, userId)),
                orderBy: [asc(tableSchemas.eventTable.start)],
            });
            console.log(events);
            return events;
        } catch (error) {
            console.error(error);
        }
    }

    async create(data: EventDTO.Insert) {
        try {
            const [event] = await this.db
                .insert(tableSchemas.eventTable)
                .values({
                    ...data,
                    start: new Date(data.start),
                    end: new Date(data.end),
                })
                .returning();
            return event;
        } catch (error) {
            console.error(error);
        }
    }
    async update(id: string, data: EventDTO.Update) {
        try {
            const event = await this.db
                .update(tableSchemas.eventTable)
                .set({
                    ...data,
                    start: new Date(data.start),
                    end: new Date(data.end),
                })
                .where(eq(tableSchemas.eventTable.id, id))
                .returning();
            return event[0];
        } catch (error) {
            console.error(error);
        }
    }
    async delete(deleteParams: EventDTO.Delete) {
        try {
            return await this.db
                .delete(tableSchemas.eventTable)
                .where(
                    and(
                        eq(tableSchemas.eventTable.id, deleteParams.id),
                        eq(tableSchemas.eventTable.userId, deleteParams.userId),
                    ),
                );
        } catch (error) {
            console.error(error);
        }
    }
}
