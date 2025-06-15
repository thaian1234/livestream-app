"use client";

import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { CheckCircle2, Wallet, WalletIcon, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { formatVND } from "@/lib/helpers/currency";
import { cn } from "@/lib/utils";

import { OrderDTO } from "@/server/api/dtos/order.dto";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { donationAnimationStyles } from "./order-animation-styles";

interface OrderDetails extends OrderDTO.Select {}

interface DonationNoticeProps {
    isSuccess: boolean;
    orderDetails: OrderDetails;
}

// Component to render payment method with appropriate styling
const PaymentMethodDisplay = ({
    method,
}: {
    method: OrderDTO.PaymentMethod;
}) => {
    if (method === "MOMO") {
        return (
            <div className="flex items-center gap-2">
                <div className="relative size-10">
                    <Image
                        src="/momo-logo.png"
                        alt="Momo"
                        fill
                        className="object-contain"
                    />
                </div>

                <span className="font-medium text-[#ae2070]">MoMo</span>
            </div>
        );
    } else if (method === "VNPAY") {
        return (
            <div className="flex items-center gap-2">
                <div className="relative size-10">
                    <Image
                        src="/vnpay-logo.png"
                        alt="VNPay"
                        fill
                        className="object-contain"
                    />
                </div>

                <span className="font-medium text-[#0066b3]">VNPay</span>
            </div>
        );
    } else if (method === "WALLET") {
        return (
            <div className="flex items-center gap-2">
                <div className="relative size-10">
                    <WalletIcon />
                </div>
            </div>
        );
    }

    return <span className="font-medium text-black-1">{method}</span>;
};

export function DonationNotice({
    isSuccess,
    orderDetails: donationDetails,
}: DonationNoticeProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(false);

    useEffect(() => {
        // Trigger animations in sequence with cleanup
        const timers = [
            setTimeout(() => setIsVisible(true), 100),
            setTimeout(() => setDetailsVisible(true), 600),
            setTimeout(() => setButtonsVisible(true), 1000),
        ];

        return () => timers.forEach(clearTimeout);
    }, []);

    const detailItems = useMemo(
        () => [
            {
                label: "Amount:",
                value: `${formatVND(donationDetails.totalAmount)}`,
                delay: "delay-2",
                isPaymentMethod: false,
            },
            {
                label: "Date:",
                value: format(
                    parseISO(donationDetails.completedAt || ""),
                    "dd/MM/yyyy HH:mm",
                    { locale: vi },
                ),
                delay: "delay-3",
                isPaymentMethod: false,
            },
            {
                label: "Payment Method:",
                value: donationDetails.paymentMethod as OrderDTO.PaymentMethod,
                delay: "delay-4",
                isPaymentMethod: true,
            },
        ],
        [donationDetails],
    );

    const successButtons = useMemo(
        () => (
            <>
                <Button
                    asChild
                    variant={"gradient"}
                    className="text-black-1 transition-transform hover:scale-105"
                >
                    <Link href="/">Return Home</Link>
                </Button>
                <Button
                    variant="outline"
                    asChild
                    className="transition-transform hover:scale-105"
                >
                    <Link
                        href={{
                            pathname: donationDetails.user.username,
                        }}
                    >
                        Make Another Donation
                    </Link>
                </Button>
            </>
        ),
        [donationDetails.user.username],
    );

    const failureButtons = useMemo(
        () => (
            <>
                <Button
                    asChild
                    className="transition-transform hover:scale-105"
                >
                    <Link href="/donate">Try Again</Link>
                </Button>
                <Button
                    variant="outline"
                    asChild
                    className="transition-transform hover:scale-105"
                >
                    <Link href="/contact">Contact Support</Link>
                </Button>
            </>
        ),
        [],
    );

    return (
        <main className="min-h-screen bg-gray-200 px-4 py-12">
            <style jsx global>
                {donationAnimationStyles}
            </style>

            <div className="mx-auto max-w-4xl">
                <div>
                    <Card
                        className={`mx-auto w-full max-w-md bg-white shadow-lg ${isVisible ? "animate-fade-in" : "opacity-0"}`}
                    >
                        <CardHeader
                            className={cn(
                                isSuccess
                                    ? "bg-green-50 text-green-900"
                                    : "bg-red-50 text-red-900",
                            )}
                        >
                            <div
                                className={`mb-4 flex justify-center ${isVisible ? "animate-scale-in" : "opacity-0"}`}
                            >
                                {isSuccess ? (
                                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                                ) : (
                                    <XCircle className="h-16 w-16 text-red-600" />
                                )}
                            </div>
                            <CardTitle
                                className={`text-center text-2xl ${isVisible ? "animate-fade-in delay-1" : "opacity-0"}`}
                            >
                                {isSuccess
                                    ? "Donation Successful!"
                                    : "Donation Failed"}
                            </CardTitle>
                            <CardDescription
                                className={`text-center text-gray-700 ${isVisible ? "animate-fade-in delay-2" : "opacity-0"}`}
                            >
                                {isSuccess
                                    ? "Thank you for your generous contribution."
                                    : "We encountered an issue processing your donation."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="bg-white pt-6">
                            <p
                                className={`mb-6 text-center text-gray-700 ${isVisible ? "animate-fade-in delay-3" : "opacity-0"}`}
                            >
                                {isSuccess
                                    ? "Your donation has been successfully processed. A confirmation email with the details of your donation has been sent to your email address."
                                    : "Unfortunately, we couldn't process your donation at this time. This could be due to an issue with the payment method or a temporary system error."}
                            </p>

                            <div
                                className={`rounded-lg border border-gray-200 bg-gray-50 p-4 ${detailsVisible ? "animate-fade-in" : "opacity-0"}`}
                            >
                                <h3 className="mb-3 text-lg font-medium text-gray-900">
                                    Donation Details
                                </h3>
                                <div className="space-y-3">
                                    {detailItems.map((item, index) => (
                                        <div
                                            key={`detail-${index}`}
                                            className={`flex items-center justify-between ${detailsVisible ? `animate-slide-in ${item.delay}` : "opacity-0"}`}
                                        >
                                            <span className="text-gray-600">
                                                {item.label}
                                            </span>
                                            {item.isPaymentMethod ? (
                                                <PaymentMethodDisplay
                                                    method={
                                                        item.value as OrderDTO.PaymentMethod
                                                    }
                                                />
                                            ) : (
                                                <span className="font-medium text-gray-900">
                                                    {item.value}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter
                            className={`flex flex-wrap justify-center gap-3 bg-white ${buttonsVisible ? "animate-fade-in" : "opacity-0"}`}
                        >
                            {isSuccess ? successButtons : failureButtons}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    );
}
