"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import {
    MessageInput,
    MessageList,
    useChannelStateContext,
} from "stream-chat-react";

import { ChatStatus, useLiveInfor } from "@/lib/stores/store-live-infor";
import { cn } from "@/lib/utils";

import { SettingDTO } from "@/server/api/dtos/setting.dto";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatMessage } from "./chat-message";
import { Community } from "./community";
import { CustomChannelHeader } from "./custom-channel-header";
import { CustomMessageInput } from "./custom-message-input";
import { PrivateChat } from "./private-chat";
import { BoxChatViewer } from "./private-chat/box-chat-viewer";

interface ChatProps {
    setting?: SettingDTO.Select;
    isHost?: boolean;
    isFollowing?: boolean;
    streamerId?: string;
}

export function Chat({
    setting,
    isHost = false,
    isFollowing = false,
    streamerId,
}: ChatProps) {
    const { messages } = useChannelStateContext();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { chatStatus, isOpenPrivateChat } = useLiveInfor();

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
            <CustomChannelHeader isHost={isHost} streamerId={streamerId} />
            {isOpenPrivateChat ? (
                isHost ? (
                    <PrivateChat streamerId={streamerId} />
                ) : (
                    <BoxChatViewer streamerId={streamerId} />
                )
            ) : chatStatus === ChatStatus.Chat ? (
                <>
                    <div className="pb-[79px] sm:pb-0">
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
                    </div>
                    <MessageInput
                        Input={() => (
                            <CustomMessageInput
                                isChatDelayed={setting?.isChatDelayed}
                                isChatEnabled={setting?.isChatEnabled}
                                isChatFollowersOnly={
                                    setting?.isChatFollowersOnly
                                }
                                isHost={isHost}
                                isFollowing={isFollowing}
                                streamerId={streamerId}
                            />
                        )}
                    />
                </>
            ) : (
                <ScrollArea
                    className={cn(
                        "flex h-[calc(100vh-9rem)] flex-col px-4 transition-all duration-300 ease-in-out",
                    )}
                >
                    <Community />
                </ScrollArea>
            )}
        </div>
    );
}
