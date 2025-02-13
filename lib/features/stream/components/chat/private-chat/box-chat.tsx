"use client";

import { ChatMessage } from "../chat-message";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import {
    MessageInput,
    MessageList,
    useChannelStateContext,
} from "stream-chat-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivateChatProps {
    setIsOpenBoxChat: (value: boolean) => void;
}
export function BoxChat({ setIsOpenBoxChat }: PrivateChatProps) {
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
        <div className="px-2 py-1">
            <div className="flex flex-row items-center border-b border-gray-700 pb-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        setIsOpenBoxChat(false);
                    }}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>
            <ScrollArea
                ref={scrollAreaRef}
                className={cn(
                    "h-[calc(100vh-16rem)] px-4 transition-all duration-300 ease-in-out",
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
            {/* <MessageInput
                Input={() => (
                    <CustomMessageInput
                        isChatDelayed={setting?.isChatDelayed}
                        isChatEnabled={setting?.isChatEnabled}
                        isChatFollowersOnly={setting?.isChatFollowersOnly}
                        isHost={isHost}
                        isFollowing={isFollowing}
                    />
                )}
            /> */}
        </div>
    );
}
