'use client'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, Heart, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';
import { handle } from "hono/vercel";


export const AfterSignin = () => {
    return (
        <>
            <button className="ml-8">
                <Avatar >
                    <AvatarImage src="/user.svg" alt="user" />
                    <AvatarFallback>user</AvatarFallback>
                </Avatar>
            </button>
            <button>
                <Bell size={28} color="#ffffff" strokeWidth={2.5} />
            </button>
            <Link href='/home'>
                <Heart size={28} color="#ffffff" strokeWidth={2.5} />
            </Link>
        </>
    )
}

export const BeforeSignin = () => {
    const router = useRouter();
    const handleSignup = () => {
        router.push("/sign-in");
    }
    return (
        <>
            <Button
                className="rounded-full bg-transparent text-white border border-white ml-8 "
                onClick={handleSignup}
            >
                Login
            </Button>
        </>
    )
}