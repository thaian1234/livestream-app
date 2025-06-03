export interface IPaymentMethod {
    id: string;
    type: "Bank" | "VNPay" | "Momo" | "ZaloPay" | "Other";
    accountName: string;
    accountNumber: string;
    bankName?: string;
    additionalInfo: string;
}
