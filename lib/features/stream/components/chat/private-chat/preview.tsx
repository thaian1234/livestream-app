"use client";

import { ArrowLeft, MessageSquare } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
    id: number;
    sender: {
        name: string;
        avatar: string;
    };
    content: string;
    timestamp: string;
    unread: boolean;
}

const messages: Message[] = [
    {
        id: 1,
        sender: {
            name: "Alice Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Hey, have you seen the latest project update?",
        timestamp: "5m ago",
        unread: true,
    },
    {
        id: 2,
        sender: {
            name: "Bob Smith",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Can we schedule a meeting for tomorrow?",
        timestamp: "15m ago",
        unread: true,
    },
    {
        id: 3,
        sender: {
            name: "Charlie Brown",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "I've sent you the files you requested. Please check...",
        timestamp: "1h ago",
        unread: false,
    },
    {
        id: 4,
        sender: {
            name: "Diana Prince",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Don't forget about the team lunch today!",
        timestamp: "2h ago",
        unread: false,
    },
    {
        id: 4,
        sender: {
            name: "Diana Prince",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Don't forget about the team lunch today!",
        timestamp: "2h ago",
        unread: true,
    },
    {
        id: 4,
        sender: {
            name: "Diana Prince",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
            "Don't forget about the team lunch today! the team lthe team lthe team lthe team lthe team l",
        timestamp: "2h ago",
        unread: false,
    },
    {
        id: 4,
        sender: {
            name: "Diana Prince",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Don't forget ",
        timestamp: "2h ago",
        unread: true,
    },
    {
        id: 4,
        sender: {
            name: "Diana Prince",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Don't forget ",
        timestamp: "2h ago",
        unread: true,
    },
];
interface PreviewProps {
    setIsOpenBoxChat: (value: boolean) => void;
}
export function Preview({ setIsOpenBoxChat }: PreviewProps) {
    return (
        <ScrollArea
            className={cn(
                "h-[calc(100vh-9rem)] p-2 transition-all duration-300 ease-in-out",
            )}
        >
            <div className="space-y-2">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "grid cursor-pointer grid-cols-[40px_1fr] items-start px-2 py-3",
                                message.unread ? "rounded-lg bg-primary/5" : "",
                            )}
                            onClick={() => {
                                //navigate box chat
                                setIsOpenBoxChat(true);
                            }}
                        >
                            <div className="relative">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={message.sender.avatar}
                                        alt={message.sender.name}
                                    />
                                    <AvatarFallback />
                                </Avatar>
                                {message.unread && (
                                    <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-600" />
                                )}
                            </div>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm leading-none text-teal-2">
                                    {message.sender.name}
                                </p>
                                <p
                                    className={cn(
                                        "line-clamp-1 text-sm",
                                        message.unread
                                            ? ""
                                            : "text-muted-foreground",
                                    )}
                                >
                                    {message.content}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="my-4 flex flex-col items-center justify-center rounded-lg bg-muted/30 p-4">
                        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="max-w-[250px] text-center text-lg text-muted-foreground">
                            No messages yet.
                        </p>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}
