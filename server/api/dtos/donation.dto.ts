import { z } from "zod";

import { OrderDTO } from "./order.dto";

export class DonationDTO {
    public static donationRequestSchema = z
        .object({
            streamerId: z.string().uuid().optional(),
            amount: z.number().positive().min(1000).max(50_000_000),
            message: z.string().max(255).optional(),
            cardId: z.string().uuid().optional(),
        })
        .extend({
            paymentMethod: OrderDTO.paymentMethodSchema,
        });
}

export namespace DonationDTO {
    export type DonationRequest = z.infer<
        typeof DonationDTO.donationRequestSchema
    >;
}
