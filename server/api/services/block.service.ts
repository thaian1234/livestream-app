import { BlockDTO } from "../dtos/block.dto";
import { Utils } from "../lib/helpers/utils";
import { IBlockRepository } from "../repositories/block.repository";

export interface IBlockService extends Utils.AutoMappedClass<BlockService> {}

export class BlockService implements IBlockService {
    constructor(private blockRepository: IBlockRepository) {}
    public async findBlockedByUserId(
        userId: string,
        offset: number = 0,
        limit: number = 0,
    ) {
        return await this.blockRepository.findBlockedByUserId(
            userId,
            offset,
            limit,
        );
    }
    public async blockToggle(data: BlockDTO.Insert) {
        console.log(data);
        const block =
            await this.blockRepository.findBlockedByBlockerAndBlocked(data);
        if (block) {
            return await this.blockRepository.unblockUser(data);
        }
        return await this.blockRepository.blockUser(data);
    }
    public async findBlockedByUserIdWithUsername(
        query: string = "",
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        return await this.blockRepository.findBlockedByUserIdWithUsername(
            query,
            userId,
            offset,
            limit,
        );
    }
    public async isBlockedOrBlocking(blockedId: string, blockerId: string) {
        return await this.blockRepository.isBlockedOrBlocking(
            blockerId,
            blockedId,
        );
    }
}
