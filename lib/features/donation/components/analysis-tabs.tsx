"use client";

import { Medal } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

import { useUser } from "@/lib/hooks/use-user";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserAvatar } from "@/components/user-avatar";

import { donationApi } from "../apis";
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
    const { user } = useUser();
    const [timeframe, setTimeframe] = useState("all"); // fetch data dựa trên state này
    const { data, error, isPending } = donationApi.query.useGetDonationStats(
        user.stream.id,
        timeframe,
    );

    if (!!error) {
        redirect("/");
    }

    if (!data || isPending) {
        return null;
    }

    const currentStats = data.data.periodStats;
    const previousStats = data.data.previousStats;
    const paymentMethodStats = data.data.paymentRank;
    const topDonors = data.data.donorRank;

    console.log(data.data);
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
                    amount={`${currentStats.totalAmount.toLocaleString(
                        "vi-VN",
                    )} VNĐ`}
                    subtitle={getChangePercentage(
                        previousStats.totalAmount,
                        currentStats.totalAmount,
                    )}
                />
                <AnalysisCard
                    title="Total Donors"
                    amount={`${currentStats.uniqueDonors}`}
                    subtitle={getChangePercentage(
                        previousStats.uniqueDonors,
                        currentStats.uniqueDonors,
                    )}
                />
                <AnalysisCard
                    title="Average Donation"
                    amount={`${currentStats.avgAmount.toLocaleString(
                        "vi-VN",
                    )} VNĐ`}
                    subtitle={getChangePercentage(
                        previousStats.avgAmount,
                        currentStats.avgAmount,
                    )}
                />
                <AnalysisCard
                    title="Highest Donation"
                    amount={`${currentStats.maxAmount.toLocaleString(
                        "vi-VN",
                    )} VNĐ`}
                    subtitle={`from ${topDonors.length > 0 ? topDonors[0].username : ""}`}
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
                            {topDonors.length > 0 &&
                                topDonors.map((donor, index) => (
                                    <div
                                        key={donor.userId}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Medal
                                                className={`h-5 w-5 text-yellow-400`}
                                            />
                                            <UserAvatar
                                                imageUrl={donor.imageUrl}
                                            />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {donor.username
                                                        ? donor.username
                                                        : ""}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {donor.donateCount}{" "}
                                                    donations
                                                </p>
                                            </div>
                                        </div>
                                        <div className="font-medium">
                                            {donor.total.toLocaleString(
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
                            {paymentMethodStats.map((method, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                                {method.paymentMethod}
                                            </span>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {method.orderCount} donations (
                                            {Math.ceil(
                                                (method.orderCount /
                                                    currentStats.totalDonations) *
                                                    100 *
                                                    100,
                                            ) / 100}
                                            %)
                                        </div>
                                    </div>
                                    <div className="h-2 w-full rounded-full">
                                        <div
                                            className="h-2 rounded-full bg-teal-2"
                                            style={{
                                                width: `${Math.ceil((method.orderCount / currentStats.totalDonations) * 100 * 100) / 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
