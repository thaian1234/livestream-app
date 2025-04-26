import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";

import { IUserRepository } from "../repositories/user.repository";

import { INotificationService } from "../external-services/notification.service";

import { OrderDTO } from "../dtos/order.dto";
import { PaymentProcessorFactory } from "./payment/payment-processor-factory";

export interface IDonationService
    extends Utils.AutoMappedClass<DonationService> {}

export class DonationService implements IDonationService {
    constructor(
        private readonly paymentProcessorFactory: PaymentProcessorFactory,
        private readonly userRepository: IUserRepository,
        private readonly notificationService: INotificationService,
    ) {}

    async createDonation(data: {
        donorId: string;
        streamerId: string;
        streamId: string;
        amount: number;
        message?: string;
        ipAddress: string;
        paymentMethod: OrderDTO.PaymentMethod;
    }) {
        // Get the appropriate payment processor
        const processor = this.paymentProcessorFactory.getProcessor(
            data.paymentMethod,
        );

        // Process the donation using the selected payment processor
        return await processor.processDonation(data);
    }

    async handleDonationCallback(
        paymentMethod: OrderDTO.PaymentMethod,
        queryParams: any,
    ) {
        try {
            // Get the appropriate payment processor
            const processor =
                this.paymentProcessorFactory.getProcessor(paymentMethod);

            const result = await processor.handlePaymentCallback(queryParams);

            if (result.success) {
                await this.sendDonationNotifications(result.orderId);
            }

            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new MyError.InternalServerError(
                "Failed to process payment callback",
            );
        }
    }

    private async sendDonationNotifications(orderId: string) {}
}
