"use client";

import { CreditCard, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useUser } from "@/lib/hooks/use-user";
import { useAuth } from "@/lib/providers/auth-provider";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { donationApi } from "../apis";
import { IPackage } from "../types/package";
import { DeletePackageDialog } from "./delete-package-dialog";
import { PackageDialog } from "./package-dialog";

export function CurrentPackages() {
    const [packageAmount, setPackageAmount] = useState(4); // Example state to track the number of packages
    const { user } = useUser();
    const { data, error, isPending } = donationApi.query.useGetDonationCard(
        user.stream.id,
    );

    const packages = data?.data.donateCards;
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Current Donation Packages{" "}
                    <span className="text-sm font-medium text-muted-foreground">
                        (Maximum 4 packages allowed)
                    </span>
                </h2>
                <PackageDialog>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-white/10"
                        disabled={packageAmount >= 4}
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </PackageDialog>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packages &&
                    packages.map((pkg) => {
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
                                                {pkg.title}
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
                                            <DeletePackageDialog
                                                packageId={pkg.id}
                                            >
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
                                        {pkg.amount.toLocaleString("vi-VN")}
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
