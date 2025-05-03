"use client";

import { useQuery } from "@tanstack/react-query";
import { Medal } from "lucide-react";
import { useEffect, useState } from "react";

import { formatVND } from "@/lib/helpers/currency";
import { baseClient } from "@/lib/shared/client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserAvatar } from "@/components/user-avatar";

import { donationApi } from "../apis";
import { AnalysisCard } from "./analysis-card";

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
    const [timeframe, setTimeframe] = useState("all");

    const { data, isPending } =
        donationApi.query.useGetDonationAnalysis(timeframe);

    if (isPending || data === undefined) {
        return <AnalysisLoading />;
    }

    const analysisData = data.data;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold">Analysis</h2>
                <Tabs
                    value={timeframe}
                    onValueChange={setTimeframe}
                    className="w-full sm:w-auto"
                >
                    <TabsList className="bg-white/10">
                        <TabsTrigger value="all">All Time</TabsTrigger>
                        <TabsTrigger value="month">This Month</TabsTrigger>
                        <TabsTrigger value="week">This Week</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <AnalysisCard
                    title="Total Donations"
                    amount={formatVND(analysisData?.totalAmount || 0)}
                    subtitle={getChangePercentage(
                        analysisData?.lastTotalAmount,
                        analysisData?.totalAmount || 0,
                    )}
                />
                <AnalysisCard
                    title="Total Donors"
                    amount={`${analysisData?.totalDonors || 0}`}
                    subtitle={getChangePercentage(
                        analysisData?.lastTotalDonors,
                        analysisData?.totalDonors || 0,
                    )}
                />
                <AnalysisCard
                    title="Average Donation"
                    amount={formatVND(analysisData?.averageDonation || 0)}
                    subtitle={getChangePercentage(
                        analysisData?.lastAverageDonation,
                        analysisData?.averageDonation || 0,
                    )}
                />
                <AnalysisCard
                    title="Highest Donation"
                    amount={formatVND(
                        analysisData?.highestDonation?.amount || 0,
                    )}
                    subtitle={`from ${analysisData?.highestDonation?.donor || "No one yet"}`}
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
                            {analysisData?.topDonors?.length ? (
                                analysisData.topDonors.map((donor, index) => (
                                    <div
                                        key={donor.id}
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
                                                    {donor.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {donor.donationCount}{" "}
                                                    donations
                                                </p>
                                            </div>
                                        </div>
                                        <div className="font-medium">
                                            {formatVND(donor.totalAmount)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    No donors yet
                                </div>
                            )}
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
                            {analysisData?.paymentMethodStats?.length ? (
                                analysisData.paymentMethodStats.map(
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
                                )
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    No payment methods data
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function AnalysisLoading() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-10 w-64" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array(4)
                    .fill(0)
                    .map((_, i) => (
                        <Card key={i} className="col-span-1">
                            <CardHeader>
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="mb-2 h-8 w-24" />
                                <Skeleton className="h-4 w-40" />
                            </CardContent>
                        </Card>
                    ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <Skeleton className="mb-2 h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        {Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="mb-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5 rounded-full" />
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div>
                                            <Skeleton className="mb-1 h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            ))}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <Skeleton className="mb-2 h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent>
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <div key={i} className="mb-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-2 w-full" />
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
