import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";

import { IDonateCardRepository } from "../repositories/donate-card.repository";

import { DonateCardDTO } from "../dtos/donate-card.dto";

export interface IDonateCardService
    extends Utils.AutoMappedClass<DonateCardService> {}

export class DonateCardService implements IDonateCardService {
    constructor(private readonly donateCardRepository: IDonateCardRepository) {}

    async createDonateCard(
        streamId: string,
        donationCardData: DonateCardDTO.Insert,
    ) {
        // Validate amount
        if (donationCardData.amount <= 0) {
            throw new MyError.BadRequestError("Amount must be greater than 0");
        }

        const ownCardNo = await this.donateCardRepository.countActiveCard(streamId) 
        if (ownCardNo > 4) {
            throw new MyError.BadRequestError("You've reach the limit number of donate card.")
        }

        return this.donateCardRepository.create({
            ...donationCardData,
            streamId,
        });
    }

    async getDonateCardById(id: string) {
        const card = await this.donateCardRepository.findById(id);

        if (!card) {
            throw new MyError.NotFoundError("Donate card not found");
        }

        return card;
    }

    async getDonateCardsByStreamId(streamId: string, includeInactive = false) {
        return this.donateCardRepository.findByStreamId(
            streamId,
            includeInactive,
        );
    }

    async updateDonateCard(
        id: string,
        streamId: string,
        donationCardData: DonateCardDTO.Update,
    ) {
        const card = await this.getDonateCardById(id);

        if (card.streamId !== streamId) {
            throw new MyError.UnauthorizedError(
                "You don't have permission to update this donate card",
            );
        }

        // Validate amount if provided
        if (!!donationCardData.amount && donationCardData.amount <= 0) {
            throw new MyError.BadRequestError("Amount must be greater than 0");
        }

        return this.donateCardRepository.update(id, donationCardData);
    }

    async deleteDonateCard(id: string, streamId: string) {
        const card = await this.getDonateCardById(id);

        if (card.streamId !== streamId) {
            throw new MyError.ForbiddenError(
                "You don't have permission to delete this donate card",
            );
        }

        return this.donateCardRepository.delete(id);
    }
}
