"use client";

import { ChevronsUpDown, CloudCog, Menu } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { FollowingSidebar } from "@/lib/features/following/components/sidebar/following-sidebar";
import { LivePreviewSidebar } from "@/lib/features/stream/components/live-preview/sidebar/live-preview-sidebar";
import useStoreSidebar from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Item } from "./item";
import "@/style/home.css";

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { sidebarState, setSidebarState } = useStoreSidebar();
    console.log(sidebarState);
    const toggleSidebar = () => {
        // setIsSidebarOpen(!isSidebarOpen);
        setSidebarState({ isOpen: !sidebarState.isOpen });
    };

    const avatars = [
        { name: "Aliceeeeeeeeeeeeeeeeeeeeeeeeeee", src: "/user.svg" },
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
                sidebarState.isOpen && "h-full w-72",
            )}
        >
            {sidebarState.isOpen ? (
                <Card className="w-auto p-4 pr-0">
                    <CardTitle className="mb-2 mr-4 flex flex-row items-center justify-between text-2xl">
                        Sidebar Content
                        <button onClick={toggleSidebar}>
                            <Menu color="#ffffff" strokeWidth={2.25} />
                        </button>
                    </CardTitle>
                    <ScrollArea className="h-[calc(100vh-4rem)]">
                        <LivePreviewSidebar />
                        <FollowingSidebar />
                    </ScrollArea>
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
