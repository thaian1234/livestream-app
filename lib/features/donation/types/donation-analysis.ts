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
    lastTotalDonations?: number;
    totalDonors: number;
    lastTotalDonors?: number;
    averageDonation: number;
    lastAverageDonation?: number;
    highestDonation: IHighestDonation;
    topDonors: ITopDonors[];
    paymentMethodStats: IPaymentMethodStats[];
}
