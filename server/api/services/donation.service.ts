import { ReturnQueryFromVNPay } from "vnpay";

import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";

import { IOrderRepository } from "../repositories/order.repository";
import { IStreamRepository } from "../repositories/stream.repository";
import { IUserRepository } from "../repositories/user.repository";

import { INotificationService } from "../external-services/notification.service";
import { IVNPayService } from "../external-services/vnpay.service";

import { OrderDTO } from "../dtos/order.dto";
import { IWalletService } from "./wallet.service";

export interface IDonationService
    extends Utils.AutoMappedClass<DonationService> {}

export class DonationService implements IDonationService {
    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly walletService: IWalletService,
        private readonly vnpayService: IVNPayService,
        private readonly userRepository: IUserRepository,
        private readonly streamRepository: IStreamRepository,
        private readonly notificationService: INotificationService,
    ) {}

    async createDonation(data: {
        donorId: string;
        streamerId: string;
        streamId: string;
        amount: number;
        message?: string;
        ipAddress: string;
    }) {
        // Validate amount
        if (data.amount <= 0) {
            throw new MyError.BadRequestError(
                "Donation amount must be greater than 0",
            );
        }

        // Validate donor exists
        const donor = await this.userRepository.findById(data.donorId);
        if (!donor) {
            throw new MyError.NotFoundError("Donor not found");
        }

        // Validate streamer exists
        const streamer = await this.userRepository.findById(data.streamerId);
        if (!streamer) {
            throw new MyError.NotFoundError("Streamer not found");
        }

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

        // Create order
        const order = await this.orderRepository.create({
            userId: data.donorId,
            streamId: data.streamId,
            totalAmount: data.amount,
            status: "PENDING",
            message: data.message,
            paymentMethod: "VNPAY",
            ipAddress: data.ipAddress,
        });

        // Create payment URL
        const orderInfo = `Donate to ${streamer.username} - ${data.message || "No message"}`;
        const paymentUrl = this.vnpayService.createPaymentUrl({
            vnp_OrderInfo: orderInfo,
            vnp_TxnRef: order.id,
            vnp_Amount: data.amount * 100,
            vnp_IpAddr: data.ipAddress,
        });

        return {
            orderId: order.id,
            paymentUrl,
        };
    }

    async handleDonationCallback(query: ReturnQueryFromVNPay) {
        // Verify return URL
        const verifyResponse = this.vnpayService.verifyReturnUrl(query);
        if (!verifyResponse.isSuccess || !verifyResponse.isVerified) {
            throw new MyError.BadRequestError("Invalid payment callback");
        }

        // Get order ID from query
        const orderId = verifyResponse.vnp_TxnRef;
        const transactionId = String(verifyResponse.vnp_TransactionNo);

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

        // Update order status based on payment result
        if (verifyResponse.isSuccess) {
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
                message: verifyResponse.message || "Payment failed",
                orderId,
            };
        }
    }

    private async processSuccessfulDonation(
        order: OrderDTO.Select,
        transactionId: string,
    ) {
        // Get streamer from stream
        const stream = await this.streamRepository.findById(order.streamId);
        if (!stream) {
            throw new MyError.NotFoundError("Stream not found");
        }
        const streamerId = stream.userId;

        const feePercentage = 10;
        const feeAmount = Math.floor(order.totalAmount * (feePercentage / 100));
        const netAmount = order.totalAmount - feeAmount;

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
        await this.walletService.addFunds(streamerWallet.id, netAmount, {
            type: "DONATION_RECEIVED",
            description: `Donation from ${order.userId}${order.message ? `: ${order.message}` : ""}`,
            orderId: order.id,
            referenceId: transactionId,
            metadata: {
                donorId: order.userId,
                streamId: order.streamId,
                feeAmount: 0,
                netAmount: 0,
            },
        });

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

        // Get donor and streamer information for notifications
        // const donor = await this.userRepository.findById(order.userId);
        // const streamer = await this.userRepository.findById(streamerId);

        // Send notification to streamer
        // await this.notificationService.createNotification({
        //     userId: streamerId,
        //     type: "DONATION",
        //     title: "New Donation Received",
        //     message: `${donor.username} donated ${order.totalAmount.toLocaleString("vi-VN")}đ to you${order.message ? `: "${order.message}"` : ""}`,
        //     metadata: {
        //         donorId: donor.id,
        //         donorUsername: donor.username,
        //         amount: order.totalAmount,
        //         message: order.message,
        //         orderId: order.id,
        //     },
        // });

        // // Send real-time notification to stream if it's active
        // const isStreamActive = await this.streamRepository.isStreamActive(
        //     order.streamId,
        // );
        // if (isStreamActive) {
        //     await this.sendStreamDonationAlert(order, donor, streamer);
        // }
    }

    private async sendStreamDonationAlert(
        order: any,
        donor: any,
        streamer: any,
    ) {
        try {
            // Send donation alert to GetStream
            // await this.getStreamService.sendStreamEvent(order.streamId, {
            //     type: "donation_alert",
            //     data: {
            //         donorId: donor.id,
            //         donorUsername: donor.username,
            //         donorImage: donor.imageUrl,
            //         amount: order.totalAmount,
            //         message: order.message,
            //         timestamp: new Date().toISOString(),
            //     },
            // });
        } catch (error) {
            console.error("Failed to send stream donation alert:", error);
            // Don't throw error here, as the donation is already processed
        }
    }
}
