import { OrderDTO } from "../../dtos/order.dto";
import { IOrderRepository } from "../../repositories/order.repository";
import { IStreamRepository } from "../../repositories/stream.repository";
import { IWalletService } from "../wallet.service";
import { BasePaymentProcessor } from "./base-payment-processor";

export class WalletProcessor extends BasePaymentProcessor {
    constructor(
        orderRepository: IOrderRepository,
        walletService: IWalletService,
        streamRepository: IStreamRepository,
    ) {
        super(orderRepository, walletService, streamRepository);
    }

    protected getPaymentMethodName(): OrderDTO.PaymentMethod {
        return "WALLET";
    }

    protected async createPaymentUrl(data: {
        orderId: string;
        amount: number;
        ipAddress: string;
        message?: string;
        streamerId: string;
    }): Promise<string> {
        return `/api/donations/callback/${this.getPaymentMethodName()}?orderId=${data.orderId}`;
    }

    protected async verifyCallback(queryParams: any): Promise<{
        isSuccess: boolean;
        message: string;
        orderId: string;
        transactionId: string;
    }> {
        const orderId = queryParams.orderId || "";
        const transactionId = `wallet_${orderId}_${Date.now()}`;

        return {
            isSuccess: true,
            message: "Wallet payment completed successfully",
            orderId,
            transactionId,
        };
    }
}
