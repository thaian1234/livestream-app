"use client";

import { ArrowLeft, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import {
    MessageInput,
    MessageList,
    useChannelStateContext,
} from "stream-chat-react";

import { useViewerId } from "@/lib/stores/store-viewer-id-chat";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatMessage } from "../chat-message";
import { CustomMessageInput } from "../custom-message-input";

interface BoxChatProps {
    streamerId?: string;
}

export function BoxChat({ streamerId }: BoxChatProps) {
    const { setViewerId } = useViewerId();
    const { messages } = useChannelStateContext();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesLengthRef = useRef(messages?.length || 0);

    const scrollToBottom = useCallback(() => {
        if (scrollAreaRef.current) {
            const scrollableNode = scrollAreaRef.current.querySelector(
                "[data-radix-scroll-area-viewport]",
            );
            if (scrollableNode) {
                scrollableNode.scrollTop = scrollableNode.scrollHeight;
            }
        }
    }, []);

    useEffect(() => {
        const currentLength = messages?.length || 0;

        // Chỉ scroll khi có tin nhắn mới
        if (currentLength > messagesLengthRef.current) {
            // Sử dụng requestAnimationFrame để tránh conflict với focus
            requestAnimationFrame(() => {
                scrollToBottom();
            });
        }

        messagesLengthRef.current = currentLength;
    }, [messages?.length, scrollToBottom]);

    // Memoize click handler
    const handleBackClick = useCallback(() => {
        if (setViewerId) setViewerId(undefined);
    }, [setViewerId]);

    return (
        <div className="px-2 py-1">
            <div className="flex flex-row items-center border-b border-gray-700 pb-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={handleBackClick}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>
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
        </div>
    );
}
