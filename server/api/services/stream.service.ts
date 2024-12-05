import { QueryDTO } from "../dtos/query.dto";
import { StreamDTO } from "../dtos/stream.dto";
import { Utils } from "../lib/helpers/utils";
import { IStreamRepository } from "../repositories/stream.repository";

export interface IStreamService extends Utils.AutoMappedClass<StreamService> {}

export class StreamService implements IStreamService {
    constructor(private streamRepository: IStreamRepository) {}
    public async advancedSearchStream(query: QueryDTO.Advanced) {
        return await this.streamRepository.advancedSearchStream(query);
    }
    public async getStreamByUserId(userId: string) {
        return await this.streamRepository.getStreamByUserId(userId);
    }
    public async createOne(streamData: StreamDTO.Insert) {
        const newStream = await this.streamRepository.createOne(streamData);
        return newStream;
    }
    public async getStreamWithSetting(userId: string) {
        return this.streamRepository.getStreamWithSetting(userId);
    }
    public async updateStream(id: string, data: StreamDTO.Update) {
        return await this.streamRepository.update(id, data);
    }
    public async getRecommendedStreamsByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        return this.streamRepository.getRecommendedStreamsByUserId(
            userId,
            offset,
            limit,
        );
    }
    public async getRecommendedStreams(offset: number = 0, limit: number = 10) {
        return this.streamRepository.getRecommendedStreams(offset, limit);
    }
    public async getFollowingStreamsByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        return this.streamRepository.getFollowingStreamsByUserId(
            userId,
            offset,
            limit,
        );
    }
    public async getStreamCategories(streamId: string) {
        return this.streamRepository.getStreamCategories(streamId);
    }
}
