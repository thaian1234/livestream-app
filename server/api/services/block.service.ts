import { Utils } from "../lib/helpers/utils";
import { BlockValidation } from "../lib/validations/schema.validation";
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
    public async blockToggle(data: BlockValidation.Insert) {
        console.log(data);
        const block =
            await this.blockRepository.findBlockedByBlockerAndBlocked(data);
        if (block) {
            return await this.blockRepository.unblockUser(data);
        }
        return await this.blockRepository.blockUser(data);
    }
    public async findBlockedByEmailOrUsername(
        query: string = "",
        userId: string,
        offset: number = 0,
        limit: number = 10,
    ) {
        return await this.blockRepository.findBlockedByEmailOrUsername(
            query,
            userId,
            offset,
            limit,
        );
    }
    public async findBlockedByBlockerAndBlocked(
        blockedId: string,
        blockerId: string,
    ) {
        return await this.blockRepository.findBlockedByBlockerAndBlocked({
            blockerId,
            blockedId,
        });
    }
}
