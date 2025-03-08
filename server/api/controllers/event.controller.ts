import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
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

                console.log(event);

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
        const respSchema = EventDTO.selectSchema.array();
        return this.factory.createHandlers(
            AuthMiddleware.isAuthenticated,
            async (c) => {
                const currentUser = c.get("getUser");
                const events = await this.eventService.getEventsByToday(
                    currentUser.id,
                );

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
