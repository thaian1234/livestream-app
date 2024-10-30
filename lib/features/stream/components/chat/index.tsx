"use client";

import { useEffect, useRef } from "react";
import {
    MessageInput,
    MessageList,
    useChannelStateContext,
} from "stream-chat-react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatMessage } from "./chat-message";
import { CustomChannelHeader } from "./custom-channel-header";
import { CustomMessageInput } from "./custom-message-input";
import { MessageSquare } from "lucide-react";

export function Chat() {
    const { messages } = useChannelStateContext();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

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
        <div className="flex w-full flex-col justify-between rounded-xl border border-gray-700 bg-transparent text-white">
            <CustomChannelHeader />
            <ScrollArea
                ref={scrollAreaRef}
                className="h-[calc(100vh-12rem)] px-4"
            >
                {messages && messages.length > 0 ? (
                    <MessageList
                        showUnreadNotificationAlways={false}
                        disableDateSeparator={false}
                        Message={ChatMessage}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] bg-muted/30 rounded-lg">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg text-center text-muted-foreground max-w-[250px]">
                            No messages yet. Let start chating!
                        </p>
                    </div>
                )}
            </ScrollArea>
            <MessageInput Input={CustomMessageInput} />
        </div>
    );
}
