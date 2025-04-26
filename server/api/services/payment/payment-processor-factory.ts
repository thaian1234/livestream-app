import { OrderDTO } from "../../dtos/order.dto";
import { BasePaymentProcessor } from "./base-payment-processor";
import { VNPayProcessor } from "./vnpay-processor";

export class PaymentProcessorFactory {
    private processors: Map<OrderDTO.PaymentMethod, BasePaymentProcessor> =
        new Map();

    constructor(
        private readonly vnpayProcessor: VNPayProcessor,
        // Add other processors when implemented
    ) {
        this.registerProcessors();
    }

    private registerProcessors() {
        this.processors.set("VNPAY", this.vnpayProcessor);
        // Register other processors when implemented
    }

    getProcessor(paymentMethod: OrderDTO.PaymentMethod): BasePaymentProcessor {
        const processor = this.processors.get(paymentMethod);
        if (!processor) {
            throw new Error(`Payment method ${paymentMethod} not supported`);
        }
        return processor;
    }
}
