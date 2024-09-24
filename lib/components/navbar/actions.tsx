"use client";

import { Bell, Heart } from "lucide-react";
import Link from "next/link";

import { SignInForm } from "@/lib/features/auth/components/signin-form";
import { SignUpForm } from "@/lib/features/auth/components/signup-form";
import { AuthDialog } from "@/lib/features/auth/layouts/auth-dialog.layout";
import { useAuth } from "@/lib/providers/auth-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

export const AfterSignin = () => {
    return (
        <>
            <button>
                <Bell size={28} color="#ffffff" strokeWidth={2.5} />
            </button>
            <Link href="/home">
                <Heart size={28} color="#ffffff" strokeWidth={2.5} />
            </Link>
            <button className="ml-8">
                <Avatar>
                    <AvatarImage src="/user.svg" alt="user" />
                    <AvatarFallback>user</AvatarFallback>
                </Avatar>
            </button>
        </>
    );
};

export const BeforeSignin = () => {
    return (
        <section className="flex space-x-2">
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

export function Actions() {
    const { isSignedIn, isPending } = useAuth();
    if (isPending) return <Spinner />;
    return isSignedIn ? <AfterSignin /> : <BeforeSignin />;
}
