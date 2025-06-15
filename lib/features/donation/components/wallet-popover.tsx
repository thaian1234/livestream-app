"use client";

import {
    Eye,
    EyeOff,
    Minus,
    Plus,
    TrendingDown,
    TrendingUp,
    Wallet,
} from "lucide-react";
import { useState } from "react";

import { formatVND } from "@/lib/helpers/currency";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { walletApi } from "../../wallet/apis";

interface WalletPopoverProps {
    children: React.ReactNode;
    onDeposit?: () => void;
    onWithdraw?: () => void;
    onViewHistory?: () => void;
}

const getTransactionIcon = (type: string) => {
    switch (type) {
        case "DONATION_SENT":
            return <Minus className="h-3 w-3 text-red-500" />;
        case "DONATION_RECEIVED":
            return <Plus className="h-3 w-3 text-green-500" />;
        case "DEPOSIT":
            return <TrendingUp className="h-3 w-3 text-blue-500" />;
        case "WITHDRAWAL":
            return <TrendingDown className="h-3 w-3 text-orange-500" />;
        case "FEE":
            return <Minus className="h-3 w-3 text-red-500" />;
        default:
            return <div className="h-3 w-3" />;
    }
};

const getTransactionColor = (type: string) => {
    switch (type) {
        case "DONATION_SENT":
        case "WITHDRAWAL":
        case "FEE":
            return "text-red-500";
        case "DONATION_RECEIVED":
        case "DEPOSIT":
            return "text-green-500";
        default:
            return "text-gray-500";
    }
};

const getTransactionLabel = (type: string) => {
    switch (type) {
        case "DONATION_SENT":
            return "Sent";
        case "DONATION_RECEIVED":
            return "Received";
        case "DEPOSIT":
            return "Deposit";
        case "WITHDRAWAL":
            return "Withdraw";
        case "FEE":
            return "Fee";
        default:
            return type;
    }
};

export function WalletPopover({
    children,
    onDeposit,
    onWithdraw,
    onViewHistory,
}: WalletPopoverProps) {
    const [showBalance, setShowBalance] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const {
        data: walletData,
        isLoading,
        error,
    } = walletApi.query.useGetWalletWithRecentTransactions("6");

    const wallet = walletData?.data?.wallet;
    const recentTransactions = walletData?.data?.recentTransactions || [];

    if (isLoading) {
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>{children}</PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-8 w-full" />
                        <div className="grid grid-cols-2 gap-2">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    if (error || !wallet) {
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>{children}</PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                    <div className="space-y-2 text-center">
                        <Wallet className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                            {error
                                ? "Failed to load wallet"
                                : "Wallet not found"}
                        </p>
                        <p className="text-xs text-gray-400">
                            Please try again or contact support if this issue
                            persists
                        </p>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="space-y-3 p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Wallet className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">My Wallet</h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowBalance(!showBalance)}
                        >
                            {showBalance ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {/* Balance */}
                    <div className="space-y-2 text-center">
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <p className="text-2xl font-bold">
                            {showBalance ? formatVND(wallet.balance) : "••••••"}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                        {wallet.totalReceived !== undefined && (
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500">
                                    Total Received
                                </p>
                                <p className="text-sm font-medium text-green-600">
                                    {showBalance
                                        ? formatVND(wallet.totalReceived)
                                        : "••••••"}
                                </p>
                            </div>
                        )}
                        {wallet.totalWithdrawn !== undefined && (
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500">
                                    Total Withdrawn
                                </p>
                                <p className="text-sm font-medium text-red-600">
                                    {showBalance
                                        ? formatVND(wallet.totalWithdrawn)
                                        : "••••••"}
                                </p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        {onDeposit && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onDeposit}
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Deposit
                            </Button>
                        )}
                        {onWithdraw && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onWithdraw}
                                disabled={
                                    !wallet.balance || wallet.balance <= 0
                                }
                            >
                                <Minus className="mr-1 h-4 w-4" />
                                Withdraw
                            </Button>
                        )}
                    </div>

                    {/* Recent Transactions */}
                    {recentTransactions.length > 0 && (
                        <>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">
                                        Recent Activity
                                    </h4>
                                    {onViewHistory && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onViewHistory}
                                            className="text-xs"
                                        >
                                            View All
                                        </Button>
                                    )}
                                </div>
                                <div className="max-h-50 space-y-2 overflow-y-auto">
                                    {recentTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                                        >
                                            <div className="flex items-center space-x-2">
                                                {getTransactionIcon(
                                                    transaction.type,
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center space-x-1">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {getTransactionLabel(
                                                                transaction.type,
                                                            )}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}
                                                >
                                                    {showBalance
                                                        ? transaction.amount > 0
                                                            ? `+${formatVND(transaction.amount)}`
                                                            : formatVND(
                                                                  transaction.amount,
                                                              )
                                                        : "••••"}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(
                                                        transaction.createdAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Footer Info */}
                    <div className="text-center">
                        <p className="text-xs text-gray-400">
                            Last updated:{" "}
                            {new Date(wallet.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
