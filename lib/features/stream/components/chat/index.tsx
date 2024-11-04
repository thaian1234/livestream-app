"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    MessageInput,
    MessageList,
    useChannelStateContext,
} from "stream-chat-react";

import { SearchBar } from "@/lib/features/search/components/search-bar";
import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { useSidebarToggle } from "@/lib/stores/use-sidebar-toggle";
import { cn } from "@/lib/utils";

import { CollapsibleSection } from "@/components/collapsible-section";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatMessage } from "./chat-message";
import { CustomChannelHeader } from "./custom-channel-header";
import { CustomMessageInput } from "./custom-message-input";

const broadcasterData = [{ id: "1", username: "user1" }];
const moderatorsData = [
    { id: "1", username: "user1" },
    { id: "2", username: "user2" },
    { id: "3", username: "user3" },
];
const communityVIPsData = [
    { id: "1", username: "user1" },
    { id: "2", username: "user2" },
    { id: "3", username: "user3" },
    { id: "4", username: "user4" },
    { id: "5", username: "user5" },
    { id: "6", username: "user6" },
    { id: "7", username: "user7" },
    { id: "8", username: "user8" },
    { id: "9", username: "user9" },
    { id: "10", username: "user10" },
];
export function Chat() {
    const { messages } = useChannelStateContext();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { chatStatus } = useLiveInfor();
    const sidebar = useSidebarToggle((state) => state);
    const [isOpenBroadcaster, setIsOpenBroadcaster] = useState(true);
    const [isOpenModerators, setIsOpenModerators] = useState(true);
    const [isOpenCommunityVIPs, setIsOpenCommunityVIPs] = useState(true);

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
                        "flex flex-col pl-4 transition-all duration-300 ease-in-out",
                        sidebar.isOpen
                            ? "h-[calc(100vh-18rem)]"
                            : "h-[calc(100vh-13rem)]",
                    )}
                >
                    <div className="my-2 pl-1 pr-5">
                        <SearchBar />
                    </div>
                    <CollapsibleSection
                        isOpen={isOpenBroadcaster}
                        setIsOpen={setIsOpenBroadcaster}
                        title={"Broadcaster"}
                    >
                        {broadcasterData.map((data) => (
                            <div
                                key={data.id}
                                className="flex items-center py-1"
                            >
                                <p>{data.username}</p>
                            </div>
                        ))}
                    </CollapsibleSection>
                    <CollapsibleSection
                        isOpen={isOpenModerators}
                        setIsOpen={setIsOpenModerators}
                        title={"Moderators"}
                    >
                        {moderatorsData.map((data) => (
                            <div
                                key={data.id}
                                className="flex items-center py-1"
                            >
                                <p>{data.username}</p>
                            </div>
                        ))}
                    </CollapsibleSection>
                    <CollapsibleSection
                        isOpen={isOpenCommunityVIPs}
                        setIsOpen={setIsOpenCommunityVIPs}
                        title={"Community VIPs"}
                    >
                        {communityVIPsData.map((data) => (
                            <div
                                key={data.id}
                                className="flex items-center py-1"
                            >
                                <p>{data.username}</p>
                            </div>
                        ))}
                    </CollapsibleSection>
                </ScrollArea>
            )}
        </div>
    );
}
