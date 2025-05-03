export interface IHighestDonation {
    amount: number;
    donor: string;
    date: string;
}
export interface ITopDonors {
    id: string;
    name: string;
    donationCount: number;
    totalAmount: number;
    imageUrl?: string | null;
}
export interface IPaymentMethodStats {
    method: string;
    count: number;
    percentage: number;
}
export interface IDonationAnalysis {
    totalDonations: number;
    totalAmount: number;
    lastTotalAmount?: number;
    totalDonors: number;
    lastTotalDonors?: number;
    averageDonation: number;
    lastAverageDonation?: number;

    highestDonation: {
        amount: number;
        donor: string;
        date: string;
    };
    topDonors: Array<{
        id: string;
        name: string;
        totalAmount: number;
        donationCount: number;
        imageUrl?: string;
    }>;
    paymentMethodStats: Array<{
        method: string;
        count: number;
        percentage: number;
    }>;
    period: string;
}
