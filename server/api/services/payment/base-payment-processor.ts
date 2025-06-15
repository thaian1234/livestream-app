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
            await this.processSuccessfulPayment(order, transactionId);

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

    protected async processSuccessfulPayment(
        order: OrderDTO.Select,
        transactionId: string,
    ): Promise<void> {
        // Get streamer from stream
        const stream = await this.streamRepository.findById(order.streamId);
        if (!stream) {
            throw new MyError.NotFoundError("Stream not found");
        }
        const streamerId = stream.userId;

        // Step 1: Handle payment method specific logic (DEPOSIT for external payments)
        await this.handlePaymentMethodSpecificLogic(order, transactionId);

        // Step 2: Process the actual donation transaction (common for all methods)
        await this.processDonationTransaction(order, streamerId);

        // Step 3: Update order status to COMPLETED
        await this.orderRepository.update(order.id, {
            status: "COMPLETED",
            externalTransactionId: transactionId,
            completedAt: new Date().toISOString(),
        });

        await this.additionalSuccessProcessing(order, transactionId);
    }

    // Handle payment method specific logic (can be overridden)
    protected async handlePaymentMethodSpecificLogic(
        order: OrderDTO.Select,
        transactionId: string,
    ): Promise<void> {
        // For external payments (VNPAY, MOMO), add funds to donor wallet first
        if (this.getPaymentMethodName() !== "WALLET") {
            const donorWallet =
                await this.walletService.createWalletIfNotExists(order.userId);

            await this.walletService.addFunds(
                donorWallet.id,
                order.totalAmount,
                {
                    type: "DEPOSIT",
                    description: `Deposit via ${this.getPaymentMethodName()} for donation`,
                    orderId: order.id,
                    referenceId: transactionId,
                    metadata: {
                        paymentMethod: this.getPaymentMethodName(),
                        externalTransactionId: transactionId,
                        purpose: "DONATION_FUNDING",
                        originalAmount: order.totalAmount,
                    },
                },
            );
        }
    }

    // Common donation transaction logic for all payment methods
    private async processDonationTransaction(
        order: OrderDTO.Select,
        streamerId: string,
    ): Promise<void> {
        const feePercentage = 10;
        const feeAmount = Math.floor(order.totalAmount * (feePercentage / 100));
        const netAmount = order.totalAmount - feeAmount;

        // Get donor and streamer wallets
        const donorWallet = await this.walletService.getWalletByUserId(
            order.userId,
        );
        const streamerWallet =
            await this.walletService.createWalletIfNotExists(streamerId);

        if (!donorWallet) {
            throw new MyError.NotFoundError("Donor wallet not found");
        }

        // Check if donor has sufficient balance
        if (donorWallet.balance < order.totalAmount) {
            throw new MyError.BadRequestError(
                "Insufficient wallet balance for donation",
            );
        }

        // Transaction 1: Deduct from donor's wallet (DONATION_SENT)
        await this.walletService.deductFunds(
            donorWallet.id,
            order.totalAmount,
            {
                type: "DONATION_SENT",
                description: `Donation to streamer${order.message ? `: ${order.message}` : ""}`,
                orderId: order.id,
                metadata: {
                    streamId: order.streamId,
                    streamerId: streamerId,
                    grossAmount: order.totalAmount,
                    feeAmount,
                    netAmount,
                    paymentMethod: this.getPaymentMethodName(),
                },
            },
        );

        // Transaction 2: Add to streamer's wallet (DONATION_RECEIVED)
        await this.walletService.addFunds(
            streamerWallet.id,
            order.totalAmount,
            {
                type: "DONATION_RECEIVED",
                description: `Donation received${order.message ? `: ${order.message}` : ""}`,
                orderId: order.id,
                metadata: {
                    donorId: order.userId,
                    streamId: order.streamId,
                    grossAmount: order.totalAmount,
                    feeAmount,
                    netAmount,
                    paymentMethod: this.getPaymentMethodName(),
                },
            },
        );

        // Transaction 3: Deduct platform fee from streamer's wallet
        await this.walletService.deductFunds(streamerWallet.id, feeAmount, {
            type: "FEE",
            description: `Platform fee (${feePercentage}%) for donation`,
            orderId: order.id,
            metadata: {
                feePercentage,
                grossAmount: order.totalAmount,
                feeAmount,
                netAmount,
                donorId: order.userId,
                paymentMethod: this.getPaymentMethodName(),
            },
        });
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
    protected async validateDonationRequest(data: {
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

        if (data.amount <= 0) {
            throw new MyError.BadRequestError("Amount must be greater than 0");
        }
    }
}
