'use client'
import "@/style/home.css"
import Image from 'next/image'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, CircleChevronLeft, CircleChevronRight, Heart, Menu, Search } from 'lucide-react'
import Link from "next/link"
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ItemInSidebar } from "@/components/sidebar/item"
import { cn } from "@/lib/utils"

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const avatars = [
        { name: 'Aliceeeeeeeeeeeeeeeeeeeeeeeee', src: '/user.svg' },
        { name: 'Bob', src: '/user.svg' },
        { name: 'Charlie', src: '/user.svg' },
        { name: 'David', src: '/user.svg' },
        { name: 'Eve', src: '/user.svg' },
        { name: 'Eve', src: '/user.svg' },

    ]
    return (
        <aside
            className={cn(
                "overflow-y-hidden w-16 h-2/4 bg-gradient-to-t from-black-2 via-teal-3 to-teal-2   flex-shrink-0 overflow-x-hidden transition-all duration-300 ease-in-out rounded-tr-3xl rounded-br-3xl",
                isSidebarOpen && 'overflow-y-auto w-72 h-full',
            )}

        >
            {isSidebarOpen ? (
                <Card className="p-4 ">
                    <CardTitle className="text-2xl justify-between flex flex-row items-center">
                        Sidebar Content
                        <button onClick={toggleSidebar}>
                            <Menu color="#ffffff" strokeWidth={2.25} />
                        </button>
                    </CardTitle>
                    <CardContent>
                        {avatars.map((avatar, index) => (
                            <ItemInSidebar
                                key={index}
                                userName={avatar.name}
                            >
                                <Image src={avatar.src} alt={avatar.name} width={50} height={50} />
                            </ItemInSidebar>
                        ))}
                    </CardContent>
                </Card>
            ) : (
                <div className="py-2 flex flex-col items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={toggleSidebar}>
                                    <Menu color="#ffffff" strokeWidth={2.25} className="my-3" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {isSidebarOpen ? "collapse" : "Expand"}
                            </TooltipContent>
                        </Tooltip>

                        {avatars.map((avatar, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Avatar className="w-10 h-10 mb-2 mx-auto">
                                        <AvatarImage src={avatar.src} alt={avatar.name} />
                                        <AvatarFallback>{avatar.name[0]}</AvatarFallback>
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
    )
}