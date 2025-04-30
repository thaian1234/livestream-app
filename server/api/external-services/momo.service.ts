import { createHmac } from "crypto";

import { envServer } from "@/lib/env/env.server";

import { Utils } from "../lib/helpers/utils";

type MomoBuildPaymentUrl = {
    amount: number;
    orderInfo: string;
    orderId: string;
    requestType: string;
    extraData?: string;
};

export interface IMomoService extends Utils.AutoMappedClass<MomoService> {}

export class MomoService implements IMomoService {
    private momoResponseStatus: Record<string, string>;
    constructor() {
        this.momoResponseStatus = {
            0: "Giao dịch thành công",
            1000: "Giao dịch đang được thực hiện",
            9000: "Giao dịch được ủy quyền thành công",
        };
    }

    async createPaymentUrl(data: MomoBuildPaymentUrl) {
        const {
            amount,
            orderId,
            orderInfo,
            requestType,
            extraData = "",
        } = data;

        const signature = this.createPaymentSignature(data);

        const requestBody = JSON.stringify({
            partnerCode: envServer.MOMO_PARTNER_CODE,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: orderId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: envServer.MOMO_REDIRECT_URL,
            ipnUrl: envServer.MOMO_IPN_URL,
            lang: envServer.MOMO_LANG,
            requestType: requestType,
            autoCapture: envServer.MOMO_AUTO_CAPTURE,
            extraData: extraData,
            orderGroupId: envServer.MOMO_ORDER_GROUP_ID,
            signature: signature,
        });

        const response = await fetch(
            "https://test-payment.momo.vn/v2/gateway/api/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: requestBody,
            },
        );

        const body = await response.json();

        return body.payUrl;
    }

    public verifyReturnUrl(body: any) {
        const rawSignature =
            `accessKey=${envServer.MOMO_ACCESS_KEY}&amount=${body.amount}&extraData=${body.extraData}&message=${body.message}` +
            `&orderId=${body.orderId}&orderInfo=${body.orderInfo}&orderType=${body.orderType}` +
            `&partnerCode=${body.partnerCode}&payType=${body.payType}&requestId=${body.requestId}` +
            `&responseTime=${body.responseTime}&resultCode=${body.resultCode}&transId=${body.transId}`;
        const signature = createHmac("sha256", envServer.MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest("hex");
        
        const response = {
            isSuccess: false,
            message: body.message,
            orderId: body.orderId,
            transactionId: body.transId || "",
        };

        if (body.resultCode === 0 && signature === body.signature) {
            response.isSuccess = true;
        }

        return response;
    }

    private createPaymentSignature(data: MomoBuildPaymentUrl) {
        const {
            amount,
            orderId,
            orderInfo,
            requestType,
            extraData = "",
        } = data;

        const rawSignature =
            "accessKey=" +
            envServer.MOMO_ACCESS_KEY +
            "&amount=" +
            amount +
            "&extraData=" +
            extraData +
            "&ipnUrl=" +
            envServer.MOMO_IPN_URL +
            "&orderId=" +
            orderId +
            "&orderInfo=" +
            orderInfo +
            "&partnerCode=" +
            envServer.MOMO_PARTNER_CODE +
            "&redirectUrl=" +
            envServer.MOMO_REDIRECT_URL +
            "&requestId=" +
            orderId +
            "&requestType=" +
            requestType;

        const signature = createHmac("sha256", envServer.MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest("hex");

        return signature;
    }
}
