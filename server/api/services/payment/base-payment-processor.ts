import { OrderDTO } from "../../dtos/order.dto";
import { MyError } from "../../lib/helpers/errors";
import { IOrderRepository } from "../../repositories/order.repository";
import { IStreamRepository } from "../../repositories/stream.repository";
import { IWalletService } from "../wallet.service";

export abstract class BasePaymentProcessor {
    constructor(
        protected readonly orderRepository: IOrderRepository,
        protected readonly walletService: IWalletService,
        protected readonly streamRepository: IStreamRepository,
    ) {}

    // Template method that defines the algorithm skeleton
    async processDonation(data: {
        donorId: string;
        streamerId: string;
        streamId: string;
        amount: number;
        message?: string;
        ipAddress: string;
    }): Promise<{ orderId: string; paymentUrl: string }> {
        // Validate streamer exists and stream belongs to streamer
        await this.validateDonationRequest(data);

        // Create order - common for all payment methods
        const order = await this.orderRepository.create({
            userId: data.donorId,
            streamId: data.streamId,
            totalAmount: data.amount,
            status: "PENDING",
            message: data.message,
            paymentMethod: this.getPaymentMethodName(),
            ipAddress: data.ipAddress,
        });

        // Create payment URL - specific to each payment method
        const paymentUrl = await this.createPaymentUrl({
            orderId: order.id,
            amount: data.amount,
            ipAddress: data.ipAddress,
            message: data.message,
            streamerId: data.streamerId,
        });

        return {
            orderId: order.id,
            paymentUrl,
        };
    }

    // Template method for handling callbacks
    async handlePaymentCallback(queryParams: any): Promise<{
        success: boolean;
        message: string;
        orderId: string;
    }> {
        // Verify callback data
        const verificationResult = await this.verifyCallback(queryParams);

        if (!verificationResult.isSuccess) {
            throw new MyError.BadRequestError("Invalid payment callback");
        }

        // Get order ID from verification result
        const orderId = verificationResult.orderId;
        const transactionId = verificationResult.transactionId;

        // Get order
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new MyError.NotFoundError("Order not found");
        }

        // Check if order is already processed
        if (order.status !== "PENDING") {
            return {
                success: order.status === "COMPLETED",
                message: `Order already ${order.status.toLowerCase()}`,
                orderId,
            };
        }

        // Process payment result
        if (verificationResult.isSuccess) {
            await this.processSuccessfulDonation(order, transactionId);

            return {
                success: true,
                message: "Donation successful",
                orderId,
            };
        } else {
            // Update order status to FAILED
            await this.orderRepository.update(orderId, {
                status: "FAILED",
                externalTransactionId: transactionId,
            });

            return {
                success: false,
                message: verificationResult.message || "Payment failed",
                orderId,
            };
        }
    }

    // Common method for all payment processors
    protected async processSuccessfulDonation(
        order: OrderDTO.Select,
        transactionId: string,
    ): Promise<void> {
        // Get streamer from stream
        const stream = await this.streamRepository.findById(order.streamId);
        if (!stream) {
            throw new MyError.NotFoundError("Stream not found");
        }
        const streamerId = stream.userId;

        const feePercentage = 10;
        const feeAmount = Math.floor(order.totalAmount * (feePercentage / 100));

        // Get or create streamer wallet
        const streamerWallet =
            await this.walletService.createWalletIfNotExists(streamerId);

        // Update order status to COMPLETED
        await this.orderRepository.update(order.id, {
            status: "COMPLETED",
            externalTransactionId: transactionId,
            completedAt: new Date().toISOString(),
        });

        // Add funds to streamer wallet
        await this.walletService.addFunds(
            streamerWallet.id,
            order.totalAmount,
            {
                type: "DONATION_RECEIVED",
                description: `Donation from ${order.userId}${order.message ? `: ${order.message}` : ""}`,
                orderId: order.id,
                referenceId: transactionId,
                metadata: {
                    donorId: order.userId,
                    streamId: order.streamId,
                    grossAmount: order.totalAmount,
                },
            },
        );

        // Record fee transaction
        await this.walletService.deductFunds(streamerWallet.id, feeAmount, {
            type: "FEE",
            description: "Platform fee for donation",
            orderId: order.id,
            metadata: {
                feePercentage,
                grossAmount: order.totalAmount,
                feeAmount,
            },
        });

        // Hook for additional processing
        await this.additionalSuccessProcessing(order, transactionId);
    }

    // Abstract methods to be implemented by concrete payment processors
    protected abstract getPaymentMethodName(): OrderDTO.PaymentMethod;

    protected abstract createPaymentUrl(data: {
        orderId: string;
        amount: number;
        ipAddress: string;
        message?: string;
        streamerId: string;
    }): Promise<string>;

    protected abstract verifyCallback(queryParams: any): Promise<{
        isSuccess: boolean;
        message: string;
        orderId: string;
        transactionId: string;
    }>;

    // Hook method that can be overridden by subclasses
    protected async additionalSuccessProcessing(
        order: OrderDTO.Select,
        transactionId: string,
    ): Promise<void> {
        // Default implementation does nothing
    }

    // Common validation logic
    private async validateDonationRequest(data: {
        streamerId: string;
        streamId: string;
        amount: number;
    }): Promise<void> {
        // Validate stream exists
        const stream = await this.streamRepository.findById(data.streamId);
        if (!stream) {
            throw new MyError.NotFoundError("Stream not found");
        }

        // Verify stream belongs to streamer
        if (stream.userId !== data.streamerId) {
            throw new MyError.BadRequestError(
                "Stream does not belong to the specified streamer",
            );
        }

        // Additional validation can be added here
        if (data.amount <= 0) {
            throw new MyError.BadRequestError("Amount must be greater than 0");
        }
    }
}
