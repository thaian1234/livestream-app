"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Bell, Heart, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const AfterSignin = () => {
    return (
        <>
            <button className="ml-8">
                <Avatar>
                    <AvatarImage src="/user.svg" alt="user" />
                    <AvatarFallback>user</AvatarFallback>
                </Avatar>
            </button>
            <button>
                <Bell size={28} color="#ffffff" strokeWidth={2.5} />
            </button>
            <Link href="/home">
                <Heart size={28} color="#ffffff" strokeWidth={2.5} />
            </Link>
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
