"use client";

import { CreditCard, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { IPackage } from "../types/package";
import { DeletePackageDialog } from "./delete-package-dialog";
import { PackageDialog } from "./package-dialog";
import { Payment } from "./payment";

// Sample donation packages
const defaultPackages: IPackage[] = [
    {
        id: "1",
        packageName: "Fan Support",
        amount: 5,
        description: "Show your support with a small donation",
        // type: "VNPay",
        // accountName: "Truong Nguyen Thuy Trang",
        // accountNumber: "1234567890",
    },
    {
        id: "2",
        packageName: "Super Fan",
        amount: 10,
        // type: "bank",
        // accountName: "Truong Nguyen Thuy",
        // accountNumber: "1234567890",
        // bankName: "Example Bank",
    },
    {
        id: "3",
        packageName: "VIP Supporter",
        amount: 25,
        description: "VIP status in chat and special perks",
        // type: "bank",
        // accountName: "Nguyen Van An ",
        // accountNumber: "1234567890",
        // bankName: "VietcomBank",
    },
];
export function CurrentPackages() {
    const [packageAmount, setPackageAmount] = useState(3); // Example state to track the number of packages
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Current Donation Packages{" "}
                    <span className="text-sm font-medium text-muted-foreground">
                        (Maximum 6 packages allowed)
                    </span>
                </h2>
                <PackageDialog>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-white/10"
                        disabled={packageAmount >= 6}
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </PackageDialog>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {defaultPackages.map((pkg) => {
                    // const IconComponent = getIconComponent(pkg.icon);
                    return (
                        <Card
                            key={pkg.id}
                            className="flex flex-col rounded-lg border border-white/50 py-4 pr-4"
                        >
                            <CardHeader>
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        {/* <IconComponent
                                            className={`h-5 w-5 ${pkg.color}`}
                                        /> */}
                                        <CardTitle className="truncate text-2xl">
                                            {pkg.packageName}
                                        </CardTitle>
                                    </div>
                                    <div>
                                        <PackageDialog defaultValue={pkg}>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="hover:bg-white/10"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </PackageDialog>
                                        <DeletePackageDialog packageId={pkg.id}>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="hover:bg-white/10"
                                            >
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </DeletePackageDialog>
                                    </div>
                                </div>

                                <CardDescription>
                                    {pkg.description ? pkg.description : ""}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="text-3xl font-bold">
                                    {pkg.amount}
                                    <span className="text-xl">VNĐ</span>
                                </div>
                                {/* {pkg.type && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                Default Payment Method
                                            </span>
                                        </div>
                                        <div className="rounded-md border bg-black-0/10 p-2">
                                            <div className="text-sm font-medium">
                                                {pkg.type === "bank"
                                                    ? pkg.bankName
                                                    : pkg.type}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {pkg.accountName} •{" "}
                                                {pkg.accountNumber}
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
