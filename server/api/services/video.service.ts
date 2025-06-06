import { createTogetherAI } from "@ai-sdk/togetherai";
import { experimental_generateImage } from "ai";

import { envServer } from "@/lib/env/env.server";

import { Utils } from "../lib/helpers/utils";

import { IVideoRepository } from "../repositories/video.repository";

import { VideoDTO } from "../dtos/video.dto";

export interface IVideoService extends Utils.AutoMappedClass<VideoService> {}

export class VideoService implements IVideoService {
    private readonly togetherai;
    constructor(private videoRepository: IVideoRepository) {
        this.togetherai = createTogetherAI({
            apiKey: envServer.TOGETHER_AI_API_KEY,
        });
    }
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
    public async getVideosWithUsername(
        username: string,
        offset: number,
        size: number,
    ) {
        return this.videoRepository.findWithUsername(username, offset, size);
    }
    public async generateThumbnail(prompt: string) {
        const { images } = await experimental_generateImage({
            model: this.togetherai.image(envServer.TOGETHER_AI_IMAGE_MODEL),
            prompt: prompt,
            size: "704x512",
            // Optional additional provider-specific request parameters
            providerOptions: {
                togetherai: {
                    steps: 20,
                },
            },
        });
        const imageBuffer = Buffer.from(images[0].base64, "base64");
        return imageBuffer;
    }
    public async findVideoForHomeProfile(username: string) {
        return await this.videoRepository.findVideoForHomeProfile(username);
    }
}
