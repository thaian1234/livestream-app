"use client";

import { Bell, Heart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { SignInForm } from "@/lib/features/auth/components/signin-form";
import { SignUpForm } from "@/lib/features/auth/components/signup-form";
import { AuthDialog } from "@/lib/features/auth/layouts/auth-dialog.layout";
import { UserNav } from "@/lib/features/user/components/user-nav";
import { useAuth } from "@/lib/providers/auth-provider";

import { Skeleton } from "@/components/ui/skeleton";

export const AfterSignin = () => {
    const { user } = useAuth();
    if (!user) {
        notFound();
    }
    return (
        <>
            <button>
                <Bell size={28} color="#ffffff" strokeWidth={2.5} />
            </button>
            <Link href={`/dashboard/${user.username}`}>
                <Heart size={28} color="#ffffff" strokeWidth={2.5} />
            </Link>
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
