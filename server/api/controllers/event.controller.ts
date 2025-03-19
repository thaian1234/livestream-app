import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import { CreateFactoryType } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { IEventService } from "../services/event.service";

import { EventDTO } from "../dtos/event.dto";

export interface IEventController
    extends Utils.PickMethods<EventController, "setupHandlers"> {}
export class EventController implements IEventController {
    constructor(
        private readonly factory: CreateFactoryType,
        private readonly eventService: IEventService,
    ) {}
    public setupHandlers() {
        return this.factory
            .createApp()
            .get("/", ...this.getAllEvents())
            .post("/", ...this.createEvent())
            .patch("/:id", ...this.updateEvent())
            .delete("/:id", ...this.deleteEvent());
    }

    private createEvent() {
        const reqSchema = EventDTO.insertSchema.omit({
            userId: true,
            streamId: true,
        });

        return this.factory.createHandlers(
            zValidator("json", reqSchema, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const currentUser = c.get("getUser");
                const event = await this.eventService.createEvent({
                    ...jsonData,
                    userId: currentUser.id,
                    streamId: currentUser.stream.id,
                    start: new Date(jsonData.start),
                    end: new Date(jsonData.end),
                });

                if (!event)
                    throw new MyError.BadRequestError("Event creation failed");

                return ApiResponse.WriteJSON({
                    c,
                    data: event,
                    msg: "Event created successfully",
                    status: HttpStatus.Created,
                });
            },
        );
    }
    private getAllEvents() {
        const querySchema = z.object({
            username: z.string().optional(),
        });
        const respSchema = EventDTO.selectSchema.array();
        return this.factory.createHandlers(
            zValidator("query", querySchema, Validator.handleParseError),
            async (c) => {
                const query = c.req.valid("query");
                const currentUser = c.get("user");
                let events;
                if (query?.username) {
                    events = await this.eventService.getEventsByUsername(
                        query.username,
                    );
                } else {
                    if (currentUser?.id) {
                        events = await this.eventService.getEventsByUserId(
                            currentUser.id,
                        );
                    } else {
                        events = [];
                    }
                }
                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.parse(events),
                    status: HttpStatus.OK,
                });
            },
        );
    }

    private getEventById() {
        const params = z.object({
            id: z.string().uuid(),
        });
        const respSchema = EventDTO.selectSchema;
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            async (c) => {
                const eventId = c.req.valid("param").id;
                const event = await this.eventService.getEventById(eventId);
                return ApiResponse.WriteJSON({
                    c,
                    data: respSchema.parse(event),
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private updateEvent() {
        const params = z.object({
            id: z.string().uuid(),
        });
        const reqSchema = EventDTO.updateSchema.omit({
            userId: true,
            streamId: true,
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            zValidator("json", reqSchema, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const jsonData = c.req.valid("json");
                const eventId = c.req.valid("param").id;
                const currentUser = c.get("getUser");
                const event = await this.eventService.updateEvent(eventId, {
                    ...jsonData,
                    userId: currentUser.id,
                    streamId: currentUser.stream.id,
                });
                return ApiResponse.WriteJSON({
                    c,
                    data: event,
                    status: HttpStatus.OK,
                });
            },
        );
    }
    private deleteEvent() {
        const params = z.object({
            id: z.string().uuid(),
        });
        return this.factory.createHandlers(
            zValidator("param", params, Validator.handleParseError),
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const eventId = c.req.valid("param").id;
                const currentUser = c.get("getUser");
                await this.eventService.deleteEvent({
                    userId: currentUser.id,
                    id: eventId,
                });
                return ApiResponse.WriteJSON({
                    c,
                    msg: "Event deleted successfully",
                    data: {
                        id: eventId,
                    },
                    status: HttpStatus.OK,
                });
            },
        );
    }
}
