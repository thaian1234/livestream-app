import { OrderDTO } from "../../dtos/order.dto";
import { MyError } from "../../lib/helpers/errors";
import { BasePaymentProcessor } from "./base-payment-processor";
import { MomoProcessor } from "./momo-processor";
import { VNPayProcessor } from "./vnpay-processor";
import { WalletProcessor } from "./wallet-processor";

export class PaymentProcessorFactory {
    private processors: Map<OrderDTO.PaymentMethod, BasePaymentProcessor> =
        new Map();

    constructor(
        private readonly vnpayProcessor: VNPayProcessor,
        private readonly momoProcessor: MomoProcessor,
        private readonly walletProcessor: WalletProcessor,
        // Add other processors when implemented
    ) {
        this.registerProcessors();
    }

    private registerProcessors() {
        this.processors.set("VNPAY", this.vnpayProcessor);
        this.processors.set("MOMO", this.momoProcessor);
        this.processors.set("WALLET", this.walletProcessor);
        // Register other processors when implemented
    }

    getProcessor(paymentMethod: OrderDTO.PaymentMethod): BasePaymentProcessor {
        const processor = this.processors.get(paymentMethod);
        if (!processor) {
            throw new MyError.BadRequestError(
                `Payment method ${paymentMethod} not supported`,
            );
        }
        return processor;
    }
}
