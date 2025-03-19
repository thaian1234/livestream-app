import { Utils } from "../lib/helpers/utils";

import { IEventRepository } from "../repositories/event.repository";

import { EventDTO } from "../dtos/event.dto";

export interface IEventService extends Utils.AutoMappedClass<EventService> {}

export class EventService implements IEventService {
    constructor(private eventRepository: IEventRepository) {}
    public async createEvent(data: EventDTO.Insert) {
        return this.eventRepository.create(data);
    }
    public async updateEvent(id: string, data: EventDTO.Update) {
        return this.eventRepository.update(id, data);
    }
    public async getEventById(id: string) {
        return this.eventRepository.findById(id);
    }
    public async getEventsByToday(userId: string) {
        return this.eventRepository.findAllByToday(userId);
    }
    public async deleteEvent(deleteParams: EventDTO.Delete) {
        return this.eventRepository.delete(deleteParams);
    }
}
