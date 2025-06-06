"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import {
    MessageInput,
    MessageList,
    useChannelStateContext,
} from "stream-chat-react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatMessage } from "../chat-message";
import { CustomMessageInput } from "../custom-message-input";

interface BoxChatViewerProps {
    streamerId?: string;
}

export function BoxChatViewer({ streamerId }: BoxChatViewerProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { messages } = useChannelStateContext();
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
        <>
            <ScrollArea
                ref={scrollAreaRef}
                className={cn(
                    "h-[calc(100vh-15rem)] px-4 transition-all duration-300 ease-in-out",
                )}
            >
                {messages && messages.length > 0 ? (
                    <MessageList
                        showUnreadNotificationAlways={false}
                        disableDateSeparator={false}
                        Message={ChatMessage}
                    />
                ) : (
                    <div className="my-4 flex flex-col items-center justify-center rounded-lg bg-muted/30 p-4">
                        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="max-w-[250px] text-center text-lg text-muted-foreground">
                            No messages yet. Let start chating!
                        </p>
                    </div>
                )}
            </ScrollArea>
            <MessageInput
                Input={() => <CustomMessageInput streamerId={streamerId} />}
            />
        </>
    );
}
