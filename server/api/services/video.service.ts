import { Utils } from "../lib/helpers/utils";

import { IVideoRepository } from "../repositories/video.repository";

import { VideoDTO } from "../dtos/video.dto";

export interface IVideoService extends Utils.AutoMappedClass<VideoService> {}

export class VideoService implements IVideoService {
    constructor(private videoRepository: IVideoRepository) {}
    public async createVideo(data: VideoDTO.Insert) {
        return this.videoRepository.create(data);
    }
    public async updateVideo(id: string, data: VideoDTO.Update) {
        return this.videoRepository.update(id, data);
    }
    public async getVideoById(id: string) {
        return this.videoRepository.findById(id);
    }
    public async getVideosByUserId(
        userId: string,
        offset: number,
        size: number,
    ) {
        return this.videoRepository.findByUserId(userId, offset, size);
    }
    public async getAllVideos() {
        return this.videoRepository.findAll();
    }
    public async deleteVideo(id: string) {
        return this.videoRepository.delete(id);
    }
    public async getVideoCategories(videoId: string) {
        return this.videoRepository.getVideoCategories(videoId);
    }
    public async checkOwnVideo(userId: string, videoId: string) {
        return await this.videoRepository.checkOwnVideo(userId, videoId);
    }
    public async getRelateVideo(videoId: string) {
        return await this.videoRepository.getRelateVideo(videoId);
    }
}
