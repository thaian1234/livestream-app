"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Bell, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/providers/auth-provider";

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
    const router = useRouter();
    const handleSignup = () => {
        router.push("/sign-in");
    };
    return (
        <>
            <Button
                className="ml-8 rounded-full border border-white bg-transparent text-white"
                onClick={handleSignup}
            >
                Login
            </Button>
        </>
    );
};

export function Actions() {
    const { isSignedIn, isPending } = useAuth();
    if (isPending) return <p>Loading...</p>;
    return isSignedIn ? <AfterSignin /> : <BeforeSignin />;
}
