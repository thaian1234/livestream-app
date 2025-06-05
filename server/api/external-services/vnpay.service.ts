import {
    BuildPaymentUrl,
    HashAlgorithm,
    ProductCode,
    QueryDr,
    QueryDrResponse,
    ReturnQueryFromVNPay,
    VNPay,
    VerifyReturnUrl,
    VerifyReturnUrlLogger,
    consoleLogger,
    dateFormat,
} from "vnpay";

import { envServer } from "@/lib/env/env.server";

import { Utils } from "../lib/helpers/utils";

export interface IVNPayService extends Utils.AutoMappedClass<VNPayService> {}

export class VNPayService implements IVNPayService {
    private readonly vnpay: VNPay;

    constructor() {
        this.vnpay = new VNPay({
            tmnCode: envServer.VNPAY_TMN_CODE,
            secureSecret: envServer.VNPAY_HASH_SECRET,
            hashAlgorithm: HashAlgorithm.SHA512,
            testMode: true,
            endpoints: {
                paymentEndpoint: "paymentv2/vpcpay.html",
                queryDrRefundEndpoint: "merchant_webapi/api/transaction",
                getBankListEndpoint: "qrpayauth/api/merchant/get_bank_list",
            },
            loggerFn: consoleLogger,
        });
    }

    public createPaymentUrl(
        data: Omit<
            BuildPaymentUrl,
            | "vnp_ReturnUrl"
            | "vnp_OrderType"
            | "vnp_CreateDate"
            | "vnp_ExpireDate"
        >,
    ) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        return this.vnpay.buildPaymentUrl({
            ...data,
            vnp_ReturnUrl: envServer.VNPAY_RETURN_URL,
            vnp_OrderType: ProductCode.CardCode,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow),
        });
    }

    public verifyReturnUrl(query: ReturnQueryFromVNPay) {
        return this.vnpay.verifyReturnUrl(query);
    }

    public getTransactionStatus(query: any): {
        isSuccess: boolean;
        message: string;
        transactionId?: string;
        responseCode: string;
    } {
        const vnpResponseCode = query.vnp_ResponseCode;
        const transactionId = query.vnp_TransactionNo;

        if (vnpResponseCode === "00") {
            return {
                isSuccess: true,
                message: "Giao dịch thành công",
                transactionId,
                responseCode: vnpResponseCode,
            };
        }

        // Map response codes to messages
        const responseMessages: Record<string, string> = {
            "02": "Giao dịch bị lỗi",
            "04": "Số tiền không hợp lệ",
            "05": "Merchant không hợp lệ",
            "06": "Danh mục không hợp lệ",
            "07": "Giao dịch đã được thực hiện",
            "09": "Giao dịch không tìm thấy",
            "10": "Giao dịch trùng lặp",
            "11": "Giao dịch đã bị hủy",
            "24": "Khách hàng hủy giao dịch",
            "51": "Tài khoản không đủ số dư",
            "65": "Tài khoản vượt quá hạn mức giao dịch",
            "75": "Ngân hàng đang bảo trì",
            "79": "OTP không hợp lệ",
            "99": "Lỗi kết nối",
        };

        return {
            isSuccess: false,
            message: responseMessages[vnpResponseCode] || "Giao dịch thất bại",
            transactionId,
            responseCode: vnpResponseCode,
        };
    }
    async queryDn(query: QueryDr) {
        return this.vnpay.queryDr(query);
    }
}
