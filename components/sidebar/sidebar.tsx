"use client";

import {
    Bell,
    CircleChevronLeft,
    CircleChevronRight,
    Heart,
    Menu,
    Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Item } from "@/components/sidebar/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import "@/style/home.css";

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const avatars = [
        { name: "Aliceeeeeeeeeeeeeeeeeeeeeeeee", src: "/user.svg" },
        { name: "Bob", src: "/user.svg" },
        { name: "Charlie", src: "/user.svg" },
        { name: "David", src: "/user.svg" },
        { name: "Eve", src: "/user.svg" },
        { name: "Eve", src: "/user.svg" },
    ];
    return (
        <aside
            className={cn(
                "h-2/4 w-16 flex-shrink-0 overflow-x-hidden overflow-y-hidden rounded-br-3xl rounded-tr-3xl bg-gradient-to-t from-black-2 via-teal-3 to-teal-2 transition-all duration-300 ease-in-out",
                isSidebarOpen && "h-full w-72 overflow-y-auto",
            )}
        >
            {isSidebarOpen ? (
                <Card className="p-4">
                    <CardTitle className="flex flex-row items-center justify-between text-2xl">
                        Sidebar Content
                        <button onClick={toggleSidebar}>
                            <Menu color="#ffffff" strokeWidth={2.25} />
                        </button>
                    </CardTitle>
                    <CardContent>
                        {avatars.map((avatar, index) => (
                            <Item key={index} userName={avatar.name}>
                                <Image
                                    src={avatar.src}
                                    alt={avatar.name}
                                    width={50}
                                    height={50}
                                />
                            </Item>
                        ))}
                    </CardContent>
                </Card>
            ) : (
                <div className="flex flex-col items-center py-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={toggleSidebar}>
                                    <Menu
                                        color="#ffffff"
                                        strokeWidth={2.25}
                                        className="my-3"
                                    />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>Expand</p>
                            </TooltipContent>
                        </Tooltip>

                        {avatars.map((avatar, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Avatar className="mx-auto mb-2 h-10 w-10">
                                        <AvatarImage
                                            src={avatar.src}
                                            alt={avatar.name}
                                        />
                                        <AvatarFallback>
                                            {avatar.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>{avatar.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            )}
        </aside>
    );
}
