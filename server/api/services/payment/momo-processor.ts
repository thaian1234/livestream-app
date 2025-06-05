import { OrderDTO } from "../../dtos/order.dto";
import { IMomoService } from "../../external-services/momo.service";
import { IOrderRepository } from "../../repositories/order.repository";
import { IStreamRepository } from "../../repositories/stream.repository";
import { IUserRepository } from "../../repositories/user.repository";
import { IWalletService } from "../wallet.service";
import { BasePaymentProcessor } from "./base-payment-processor";

export class MomoProcessor extends BasePaymentProcessor {
    constructor(
        private readonly momoService: IMomoService,
        private readonly userRepository: IUserRepository,
        orderRepository: IOrderRepository,
        walletService: IWalletService,
        streamRepository: IStreamRepository,
    ) {
        super(orderRepository, walletService, streamRepository);
    }

    protected getPaymentMethodName(): OrderDTO.PaymentMethod {
        return "MOMO";
    }

    protected async createPaymentUrl(data: {
        orderId: string;
        amount: number;
        message?: string;
        streamerId: string;
    }): Promise<string> {
        const streamer = await this.userRepository.findById(data.streamerId);
        const orderInfo = `Donate to ${streamer?.username || "streamer"} - ${data.message || "No message"}`;
        const requestType = "payWithMethod";
        const extraData = "";
        return this.momoService.createPaymentUrl({
            orderInfo: orderInfo,
            orderId: data.orderId,
            amount: data.amount,
            extraData: extraData,
            requestType: requestType,
        });
    }

    protected async verifyCallback(queryParams: any): Promise<{
        isSuccess: boolean;
        message: string;
        orderId: string;
        transactionId: string;
    }> {
        const verifyResponse = this.momoService.verifyReturnUrl(queryParams);

        return {
            isSuccess: verifyResponse.isSuccess,
            message: verifyResponse.message || "",
            orderId: verifyResponse.orderId,
            transactionId: String(verifyResponse.transactionId || ""),
        };
    }
}
