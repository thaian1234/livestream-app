"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../../components/ui/avatar";
import { Input } from "../../../components/ui/input";
import { Bell, Heart, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { AfterSignin, BeforeSignin } from "./right-navbar";

export default function Navbar() {
    const [isSignin, setIsSignin] = useState(false);
    return (
        <div className="max-w-screen-w flex h-14 justify-between bg-opacity-75 bg-gradient-to-r from-black-1 to-teal-2 px-6">
            <div className="flex items-center">
                <Link href="/home">
                    <Image
                        src="/logoipsum-330.svg"
                        alt="logo"
                        width={150}
                        height={100}
                    />
                </Link>
            </div>
            <div className="flex flex-row-reverse items-center space-x-8">
                {isSignin ? <AfterSignin /> : <BeforeSignin />}
                <div className="relative">
                    <Input
                        type="search"
                        placeholder="Search"
                        className="rounded-full border-0 bg-search pr-10 text-white placeholder-white focus-visible:ring-white"
                        customSize="sm"
                    />
                    <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white" />
                </div>
            </div>
        </div>
    );
}
