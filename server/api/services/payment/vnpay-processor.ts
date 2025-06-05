import { ReturnQueryFromVNPay } from "vnpay";

import { OrderDTO } from "../../dtos/order.dto";
import { IVNPayService } from "../../external-services/vnpay.service";
import { IOrderRepository } from "../../repositories/order.repository";
import { IStreamRepository } from "../../repositories/stream.repository";
import { IUserRepository } from "../../repositories/user.repository";
import { IWalletService } from "../wallet.service";
import { BasePaymentProcessor } from "./base-payment-processor";

export class VNPayProcessor extends BasePaymentProcessor {
    constructor(
        private readonly vnpayService: IVNPayService,
        private readonly userRepository: IUserRepository,
        orderRepository: IOrderRepository,
        walletService: IWalletService,
        streamRepository: IStreamRepository,
    ) {
        super(orderRepository, walletService, streamRepository);
    }

    protected getPaymentMethodName(): OrderDTO.PaymentMethod {
        return "VNPAY";
    }

    protected async createPaymentUrl(data: {
        orderId: string;
        amount: number;
        ipAddress: string;
        message?: string;
        streamerId: string;
    }): Promise<string> {
        const streamer = await this.userRepository.findById(data.streamerId);
        const orderInfo = `Donate to ${streamer?.username || "streamer"} - ${data.message || "No message"}`;

        return this.vnpayService.createPaymentUrl({
            vnp_OrderInfo: orderInfo,
            vnp_TxnRef: data.orderId,
            vnp_Amount: data.amount,
            vnp_IpAddr: data.ipAddress,
        });
    }

    protected async verifyCallback(queryParams: ReturnQueryFromVNPay): Promise<{
        isSuccess: boolean;
        message: string;
        orderId: string;
        transactionId: string;
    }> {
        const verifyResponse = this.vnpayService.verifyReturnUrl(queryParams);

        return {
            isSuccess: verifyResponse.isSuccess,
            message: verifyResponse.message || "",
            orderId: verifyResponse.vnp_TxnRef,
            transactionId: String(queryParams.vnp_TransactionNo || ""),
        };
    }
}
