import { Utils } from "../lib/helpers/utils";

import { IEventRepository } from "../repositories/event.repository";

import { EventDTO } from "../dtos/event.dto";
import { IUserService } from "./user.service";

export interface IEventService extends Utils.AutoMappedClass<EventService> {}

export class EventService implements IEventService {
    constructor(
        private eventRepository: IEventRepository,
        private readonly userService: IUserService,
    ) {}
    public async createEvent(data: EventDTO.Insert) {
        return this.eventRepository.create(data);
    }
    public async updateEvent(id: string, data: EventDTO.Update) {
        return this.eventRepository.update(id, data);
    }
    public async getEventById(id: string) {
        return this.eventRepository.findById(id);
    }
    public async getEventsByUserId(userId: string) {
        return this.eventRepository.findAllByUserId(userId);
    }
    public async getEventsByUsername(username: string) {
        const user = await this.userService.findByUsername(username);
        if (!user) return null;
        return this.eventRepository.findAllByUserId(user.id);
    }
    public async deleteEvent(deleteParams: EventDTO.Delete) {
        return this.eventRepository.delete(deleteParams);
    }
}
