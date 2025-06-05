import { formatVND } from "@/lib/helpers/currency";

import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";

import { IOrderRepository } from "../repositories/order.repository";
import { IStreamRepository } from "../repositories/stream.repository";
import { IUserRepository } from "../repositories/user.repository";

import { IGetStreamService } from "../external-services/getstream.service";
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
        private readonly streamRepository: IStreamRepository,
        private readonly getStreamService: IGetStreamService,
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
        const stream = await this.streamRepository.findById(order.streamId);

        // Send notification to streamer
        if (!stream || !donor)
            throw new MyError.NotFoundError("Stream or Donor not found");

        await this.notificationService.createStreamDonationNotification({
            actorAvatar: donor?.imageUrl || "",
            actorName: donor?.username || "",
            actorId: donor?.id || "",
            targetId: stream?.userId || "",
            extraData: {
                title: "New Donation Received",
                amount: order.totalAmount,
                message: order.message,
                orderId: order.id,
            },
        });

        const donateMessageInfo = `${donor.username},${formatVND(order.totalAmount)}`;
        await this.getStreamService.sendSystemMessageToChannel(
            stream.id,
            donateMessageInfo,
        );
    }
}
