import { z } from "zod";

import { OrderDTO } from "./order.dto";

export class DonationDTO {
    public static donationRequestSchema = z
        .object({
            streamerId: z.string().uuid(),
            streamId: z.string().uuid(),
            amount: z.number().positive(),
            message: z.string().max(255).optional(),
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
