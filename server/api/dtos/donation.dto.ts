import { z } from "zod";

export class DonationDTO {
    public static donationRequestSchema = z.object({
        streamerId: z.string().uuid(),
        streamId: z.string().uuid(),
        amount: z.number().positive(),
        message: z.string().max(255).optional(),
    });
}

export namespace DonationDTO {
    export type DonationRequest = z.infer<
        typeof DonationDTO.donationRequestSchema
    >;
}
