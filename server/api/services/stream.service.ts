import { Utils } from "../lib/helpers/utils";
import { IStreamRepository } from "../repositories/stream.repository";

export interface IStreamService extends Utils.AutoMappedClass<StreamService> {}

export class StreamService implements IStreamService {
    constructor(private streamRepository: IStreamRepository) {}
    public async advancedSearchStream(
        name: string = "",
        dateFrom: Date = new Date("2000-01-01"),
        dateTo: Date = new Date(),
        isSortByCreatedAt: boolean = false,
        sortOrder: string = "asc",
        offset: number = 0,
        limit: number = 10,
    ) {
        return await this.streamRepository.advancedSearchStream(
            name,
            dateFrom,
            dateTo,
            isSortByCreatedAt,
            sortOrder,
            offset,
            limit,
        );
    }
    public async getStreamByUserId(userId: string) {
        return await this.streamRepository.getStreamByUserId(userId);
    }
}
