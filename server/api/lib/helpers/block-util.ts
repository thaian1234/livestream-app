import { BlockRepository } from "../../repositories/block.repository";

import { MyError } from "./errors";

const blockRepository = new BlockRepository();

async function checkUserBlock(blockerId: string, blockedId: string) {
    const block = await blockRepository.findBlockedOrBlocking(
        blockerId,
        blockedId,
    );
    if (!block) return;
    if (block.blockerId === blockerId) {
        throw new MyError.UnauthorizedError("You are blocking this user");
    }
    throw new MyError.UnauthorizedError("You are blocked by this user");
}

export const BlockUtils = {
    checkUserBlock,
};
