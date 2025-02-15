"use client";

import useStreamerPrivateChats from "../../../hooks/use-streamer-private-chats";
import { MessageSquare } from "lucide-react";

import { timeAgo } from "@/lib/helpers/formatData";
import { useViewerId } from "@/lib/stores/store-viewer-id-chat";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewProps {
    streamerId?: string;
}
export function Preview({ streamerId }: PreviewProps) {
    const chats = useStreamerPrivateChats(streamerId);
    const { setViewerId } = useViewerId();
    return (
        <ScrollArea
            className={cn(
                "h-[calc(100vh-9rem)] p-2 transition-all duration-300 ease-in-out",
            )}
        >
            <div className="space-y-2">
                {chats.length > 0 ? (
                    chats.map((chat) => {
                        const isUnread = chat.state.unreadCount > 0;
                        const sender = Object.values(chat.state.members).find(
                            (m) => m?.user?.id !== streamerId,
                        )?.user;
                        const unreadMessage =
                            chat.state.messages[chat.state.messages.length - 1];
                        if (!unreadMessage) return;
                        return (
                            <div
                                key={chat.id}
                                className={cn(
                                    "grid cursor-pointer grid-cols-[40px_1fr] items-start px-2 py-3",
                                    isUnread ? "rounded-lg bg-primary/5" : "",
                                )}
                                onClick={() => {
                                    setViewerId?.(sender?.id);
                                }}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={sender?.image}
                                            alt={sender?.name}
                                        />
                                        <AvatarFallback />
                                    </Avatar>
                                    {isUnread && (
                                        <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-600" />
                                    )}
                                </div>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm leading-none text-teal-2">
                                        {sender?.name}
                                    </p>
                                    <p
                                        className={cn(
                                            "line-clamp-1 text-sm",
                                            isUnread
                                                ? ""
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        {unreadMessage?.text}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {timeAgo(unreadMessage?.created_at)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
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
