import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";

import { IOrderRepository } from "../repositories/order.repository";
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
        private readonly orderRepository: IOrderRepository,
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
            throw new MyError.InternalServerError(
                "Failed to process payment callback",
            );
        }
    }

    private async sendDonationNotifications(orderId: string) {
        // Get donor and streamer information for notifications
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new MyError.NotFoundError("Order not found");
        }
        const donor = await this.userRepository.findById(order.userId);

        // Send notification to streamer
        await this.notificationService.createStreamDonationNotification({
            actorAvatar: donor?.imageUrl || "",
            actorName: donor?.username || "",
            actorId: donor?.id || "",
            targetId: order.streamId,
            extraData: {
                title: "New Donation Received",
                amount: order.totalAmount,
                message: order.message,
                orderId: order.id,
            },
        });
    }
}
