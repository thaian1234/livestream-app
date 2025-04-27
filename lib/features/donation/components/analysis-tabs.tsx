"use client";

import { Medal } from "lucide-react";
import { useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserAvatar } from "@/components/user-avatar";

import { IDonationAnalysis } from "../types/donation-analysis";
import { AnalysisCard } from "./analysis-card";

const dummmyAnalysisForAllTime: IDonationAnalysis = {
    totalDonations: 12500000,
    totalDonors: 87,
    averageDonation: 140037,
    highestDonation: {
        amount: 50,
        donor: "StreamFan42",
        date: "2024-04-20",
    },
    topDonors: [
        { id: "1", name: "StreamFan42", totalAmount: 120, donationCount: 5 },
        { id: "2", name: "GamerGirl99", totalAmount: 85, donationCount: 7 },
        { id: "3", name: "JohnDoe", totalAmount: 75, donationCount: 3 },
        {
            id: "4",
            name: "SuperSupporterXL",
            totalAmount: 50,
            donationCount: 2,
        },
        { id: "5", name: "TwitchFan2000", totalAmount: 45, donationCount: 9 },
    ],
    paymentMethodStats: [
        { method: "VnPay", count: 45, percentage: 52 },
        { method: "Momo", count: 32, percentage: 37 },
        { method: "Cryptocurrency", count: 8, percentage: 9 },
        { method: "Other", count: 2, percentage: 2 },
    ],
};

// Sample statistics data
const dummyAnalysis: IDonationAnalysis = {
    totalDonations: 12500000,
    lastTotalDonations: 13000000,
    totalDonors: 87,
    lastTotalDonors: 75,
    averageDonation: 140037,
    lastAverageDonation: 120000,
    highestDonation: {
        amount: 500000,
        donor: "StreamFan42",
        date: "2024-04-20",
    },
    topDonors: [
        {
            id: "1",
            name: "StreamFan42",
            totalAmount: 120,
            donationCount: 5,
            imageUrl: "",
        },
        {
            id: "2",
            name: "GamerGirl99",
            totalAmount: 85,
            donationCount: 7,
            imageUrl: "",
        },
        {
            id: "3",
            name: "JohnDoe",
            totalAmount: 75,
            donationCount: 3,
        },
        {
            id: "4",
            name: "SuperSupporterXL",
            totalAmount: 50,
            donationCount: 2,
        },
        { id: "5", name: "TwitchFan2000", totalAmount: 45, donationCount: 9 },
    ],
    paymentMethodStats: [
        { method: "VnPay", count: 45, percentage: 100 },
        { method: "Momo", count: 32, percentage: 37 },
        { method: "Cryptocurrency", count: 8, percentage: 9 },
        { method: "Other", count: 2, percentage: 2 },
    ],
};
function getChangePercentage(oldValue: number | undefined, newValue: number) {
    if (!oldValue) return "";
    if (oldValue === 0) {
        return newValue === 0
            ? "No change from last period"
            : "Last period is 0 VNĐ";
    }

    const change = ((newValue - oldValue) / oldValue) * 100;
    const sign = change >= 0 ? "+" : "";
    const formattedChange = change.toFixed(1); // làm tròn 1 chữ số thập phân

    return `${sign}${formattedChange}% from last period`;
}
export default function AnalysisTabs() {
    const [timeframe, setTimeframe] = useState("all"); // fetch data dựa trên state này

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold">Analysis</h2>
                <Tabs defaultValue="all" className="w-full sm:w-auto">
                    <TabsList className="bg-white/10">
                        <TabsTrigger
                            value="all"
                            onClick={() => setTimeframe("all")}
                        >
                            All Time
                        </TabsTrigger>
                        <TabsTrigger
                            value="month"
                            onClick={() => setTimeframe("month")}
                        >
                            This Month
                        </TabsTrigger>
                        <TabsTrigger
                            value="week"
                            onClick={() => setTimeframe("week")}
                        >
                            This Week
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <AnalysisCard
                    title="Total Donations"
                    amount={`${dummyAnalysis.totalDonations.toLocaleString(
                        "vi-VN",
                    )} VNĐ`}
                    subtitle={getChangePercentage(
                        dummyAnalysis.lastTotalDonations,
                        dummyAnalysis.totalDonations,
                    )}
                />
                <AnalysisCard
                    title="Total Donors"
                    amount={`${dummyAnalysis.totalDonors} VNĐ`}
                    subtitle={getChangePercentage(
                        dummyAnalysis.lastTotalDonors,
                        dummyAnalysis.totalDonors,
                    )}
                />
                <AnalysisCard
                    title="Average Donation"
                    amount={`${dummyAnalysis.averageDonation.toLocaleString(
                        "vi-VN",
                    )} VNĐ`}
                    subtitle={getChangePercentage(
                        dummyAnalysis.lastAverageDonation,
                        dummyAnalysis.averageDonation,
                    )}
                />
                <AnalysisCard
                    title="Highest Donation"
                    amount={`${dummyAnalysis.highestDonation.amount.toLocaleString(
                        "vi-VN",
                    )} VNĐ`}
                    subtitle={`from ${dummyAnalysis.highestDonation.donor}`}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1 rounded-lg border border-white/30 py-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">Top Donors</CardTitle>
                        <CardDescription>
                            Your most generous supporters
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dummyAnalysis.topDonors.map((donor, index) => (
                                <div
                                    key={donor.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <Medal
                                            className={`h-5 w-5 text-yellow-400`}
                                        />
                                        <UserAvatar imageUrl={donor.imageUrl} />
                                        <div>
                                            <p className="text-sm font-medium">
                                                {donor.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {donor.donationCount} donations
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-medium">
                                        {donor.totalAmount.toLocaleString(
                                            "vi-VN",
                                        )}{" "}
                                        VNĐ
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 rounded-lg border border-white/30 py-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Payment Methods
                        </CardTitle>
                        <CardDescription>
                            Distribution of donations by payment method
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dummyAnalysis.paymentMethodStats.map(
                                (method, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {method.method}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {method.count} donations (
                                                {method.percentage}%)
                                            </div>
                                        </div>
                                        <div className="h-2 w-full rounded-full">
                                            <div
                                                className="h-2 rounded-full bg-teal-2"
                                                style={{
                                                    width: `${method.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
