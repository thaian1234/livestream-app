"use client";

import { CreditCard, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { IPaymentMethod } from "../types/payment";
import { DeletePaymentDialog } from "./delete-payment-dialog";
import { PaymentDialog } from "./payment-dialog";

// Sample payment methods
const defaultPaymentMethods: IPaymentMethod[] = [
    {
        id: "1",
        type: "Bank",
        accountName: "Trương Nguyễn Thùy Trang",
        accountNumber: "1234567890",
        bankName: "Vietcombank",
        additionalInfo: "Please include your username in the transfer note",
    },
    {
        id: "2",
        type: "VNPay",
        accountName: "Phạm Tấn Huy Hùng",
        accountNumber: "9876543210",
        additionalInfo: "",
    },
];

export function Payment() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Payment Methods</h2>
                <PaymentDialog>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-white/10"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </PaymentDialog>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {defaultPaymentMethods.map((method) => (
                    <Card
                        key={method.id}
                        className="flex flex-col rounded-lg border border-white/50 py-4 pr-4"
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-1 items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    <CardTitle className="text-lg">
                                        {method.type === "Bank"
                                            ? "Bank Transfer"
                                            : method.type}
                                    </CardTitle>
                                </div>
                                <div className="flex items-center">
                                    <PaymentDialog defaultValue={method}>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="hover:bg-white/10"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </PaymentDialog>
                                    <DeletePaymentDialog paymentId={method.id}>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="hover:bg-white/10"
                                        >
                                            <Trash className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </DeletePaymentDialog>
                                </div>
                            </div>
                            <CardDescription>
                                {method.type === "Bank" ? (
                                    <p className="text-sm text-muted-foreground">
                                        {method.bankName}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {method.type}
                                    </p>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-sm font-medium">
                                        Account Name
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {method.accountName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Account Number
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {method.accountNumber}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
