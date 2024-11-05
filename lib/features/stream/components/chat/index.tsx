"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import {
    MessageInput,
    MessageList,
    useChannelStateContext,
} from "stream-chat-react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { useSidebarToggle } from "@/lib/stores/use-sidebar-toggle";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatMessage } from "./chat-message";
import { Community } from "./community";
import { CustomChannelHeader } from "./custom-channel-header";
import { CustomMessageInput } from "./custom-message-input";

export function Chat() {
    const { messages } = useChannelStateContext();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { chatStatus } = useLiveInfor();
    const sidebar = useSidebarToggle((state) => state);

    //chat scrolls to the bottom
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollableNode = scrollAreaRef.current.querySelector(
                "[data-radix-scroll-area-viewport]",
            );
            if (scrollableNode) {
                scrollableNode.scrollTop = scrollableNode.scrollHeight;
            }
        }
    }, [messages]);

    return (
        <div className="flex w-full flex-col rounded-xl border border-gray-700 bg-transparent text-white">
            <CustomChannelHeader />
            {chatStatus === "Chat" ? (
                <>
                    <ScrollArea
                        ref={scrollAreaRef}
                        className={cn(
                            "px-4 transition-all duration-300 ease-in-out",
                            sidebar.isOpen
                                ? "h-[calc(100vh-21rem)]"
                                : "h-[calc(100vh-16rem)]",
                        )}
                    >
                        {messages && messages.length > 0 ? (
                            <MessageList
                                showUnreadNotificationAlways={false}
                                disableDateSeparator={false}
                                Message={ChatMessage}
                            />
                        ) : (
                            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg bg-muted/30">
                                <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="max-w-[250px] text-center text-lg text-muted-foreground">
                                    No messages yet. Let start chating!
                                </p>
                            </div>
                        )}
                    </ScrollArea>
                    <MessageInput Input={CustomMessageInput} />
                </>
            ) : (
                <ScrollArea
                    className={cn(
                        "flex flex-col px-4 transition-all duration-300 ease-in-out",
                        sidebar.isOpen
                            ? "h-[calc(100vh-18rem)]"
                            : "h-[calc(100vh-13rem)]",
                    )}
                >
                    <Community />
                </ScrollArea>
            )}
        </div>
    );
}
