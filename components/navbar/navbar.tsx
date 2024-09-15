'use client'
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, Heart, Search } from "lucide-react";
import { Input } from "../ui/input";
import { AfterSignin, BeforeSignin } from "./right-navbar";
import { useState } from "react";

export default function Navbar() {
    const [isSignin, setIsSignin] = useState(false);
    return (
        <div className="max-w-screen-w h-14 flex justify-between px-6 bg-gradient-to-r from-black-1 to-teal-2 bg-opacity-75">
            <div className="flex items-center">
                <Link href='/home'>
                    <Image src="/logoipsum-330.svg" alt="logo" width={150} height={100} />
                </Link>
            </div>
            <div className="flex flex-row-reverse items-center space-x-8">
                {isSignin ? <AfterSignin /> : <BeforeSignin />}
                <div className="relative">
                    <Input
                        type="search"
                        placeholder="Search"
                        className=" pr-10 text-white placeholder-white bg-search rounded-full border-0 focus-visible:ring-white "
                        customSize="sm"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                </div>
            </div>
        </div>
    )
}