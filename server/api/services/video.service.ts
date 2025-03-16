import { Utils } from "../lib/helpers/utils";

import { IVideoRepository } from "../repositories/video.repository";

import { VideoDTO } from "../dtos/video.dto";
import { envServer } from "@/lib/env/env.server";

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
    public async getVideosByUserId(userId: string, offset: number, size: number) {
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
    public async getThumbnail(prompt: string) {
            const API_URL = `https://api.cloudflare.com/client/v4/accounts/${envServer.CLOUDFLARE_WORKER_AI_ACCOUNT_ID}/ai/run/${envServer.CLOUDFLARE_WORKER_AI_TEXT_IMAGE_MODEL}`;
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${envServer.CLOUDFLARE_WORKER_AI_API_TOKEN}`,
                },
                method: "POST",
                body: JSON.stringify({ prompt }),
            });
            const rawData = await response.json();
            const data = VideoDTO.cloudflareAIResponseSchema.parse(rawData);
            if (!data.success || !data.result || !("image" in data.result)) return;
            const imageBuffer = Buffer.from(data.result.image, "base64");
            return imageBuffer;
        }
}
