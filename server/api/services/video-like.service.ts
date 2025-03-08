import { Utils } from "../lib/helpers/utils";

import { IVideoLikeRepository } from "../repositories/video-like.repository";

import { VideoLikeDTO } from "../dtos/video-like.dto";

export interface IVideoLikeService
    extends Utils.AutoMappedClass<VideoLikeService> {}

export class VideoLikeService implements IVideoLikeService {
    constructor(private videolikeRepository: IVideoLikeRepository) {}
    public async toggleLike(userId: string, videoId: string, isLike: boolean) {
        return this.videolikeRepository.toggleLike(userId, videoId, isLike);
    }
}
