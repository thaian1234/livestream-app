"use client";

import { Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

import { SignInForm } from "@/lib/features/auth/components/signin-form";
import { SignUpForm } from "@/lib/features/auth/components/signup-form";
import { AuthDialog } from "@/lib/features/auth/layouts/auth-dialog.layout";
import { WalletPopover } from "@/lib/features/donation/components/wallet-popover";
import { NotificationPopover } from "@/lib/features/notification/components/notification-popover";
import { UserNav } from "@/lib/features/user/components/user-nav";
import { useAuth } from "@/lib/providers/auth-provider";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const AfterSignin = () => {
    const { user } = useAuth();

    if (!user) {
        notFound();
    }

    return (
        <>
            <NotificationPopover />
            <WalletPopover>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Wallets"
                >
                    <Wallet
                        className="size-6"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </Button>
            </WalletPopover>
            <UserNav />
        </>
    );
};

export const BeforeSignin = () => {
    return (
        <section className="flex space-x-3">
            <AuthDialog
                isSignIn={true}
                title="Sign In"
                subTitle="Glad you're back!"
            >
                <SignInForm />
            </AuthDialog>
            <AuthDialog
                isSignIn={false}
                title="Sign Up"
                subTitle="Just some details to get you in !"
            >
                <SignUpForm />
            </AuthDialog>
        </section>
    );
};
export const IsPending = () => {
    return (
        <div className="flex items-center justify-around space-x-8">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    );
};

export function Actions() {
    const { isSignedIn, isPending } = useAuth();

    if (isPending) return <IsPending />;

    return isSignedIn ? <AfterSignin /> : <BeforeSignin />;
}
