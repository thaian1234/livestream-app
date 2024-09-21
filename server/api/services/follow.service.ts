import { Utils } from "../lib/helpers/utils";
import { FollowValidation } from "../lib/validations/schema.validation";
import { IFollowRepository } from "../repositories/follow.repository";

import { IBlockService } from "./block.service";

export interface IFollowService extends Utils.AutoMappedClass<FollowService> {}

export class FollowService implements IFollowService {
    constructor(
        private followRepository: IFollowRepository,
        private blockService: IBlockService,
    ) {}
    public async followToggle(data: FollowValidation.Insert) {
        const follow = await this.findByFollowerAndFollowed(
            data.followerId,
            data.followedId,
        );
        if (!follow) {
            return await this.followRepository.create(data);
        }
        return await this.followRepository.delete(data);
    }
    public async findFollowingByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        return await this.followRepository.findFollowingByUserId(
            userId,
            offset,
            limit,
        );
    }
    public async findFollowerByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        return await this.followRepository.findFollowerByUserId(
            userId,
            offset,
            limit,
        );
    }
    public async findRecommendedByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        return await this.followRepository.findRecommendByUserId(
            userId,
            offset,
            limit,
        );
    }
    public async findByFollowerAndFollowed(
        followerId: string,
        followedId: string,
    ) {
        const isBlocked = await this.blockService.isBlockedOrBlocking(
            followedId,
            followerId,
        );

        if (isBlocked) {
            return null;
        }

        return await this.followRepository.findByFollowerAndFollowed(
            followerId,
            followedId,
        );
    }
}
