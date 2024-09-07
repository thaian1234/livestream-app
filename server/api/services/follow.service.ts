import { Utils } from "../lib/helpers/utils";
import { FollowValidation } from "../lib/validations/schema.validation";
import { IFollowRepository } from "../repositories/follow.repository";
import { use } from "react";

export interface IFollowService extends Utils.AutoMappedClass<FollowService> {}

export class FollowService implements IFollowService {
    constructor(private followRepository: IFollowRepository) {}
    public async createFollow(data: FollowValidation.Insert) {
        return await this.followRepository.create(data);
    }
    public async deleteFollow(data: FollowValidation.Delete) {
        return await this.followRepository.delete(data);
    }
    public async findFollowingByUserId(userId: string) {
        return await this.followRepository.findFollowingByUserId(userId);
    }
    public async findFollowerByUserId(userId: string) {
        return await this.followRepository.findFollowerByUserId(userId);
    }
    public async findRecommendedByUserId(userId: string) {
        return await this.followRepository.findRecommendByUserId(userId);
    }
}
