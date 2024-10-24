import useInitializeChatClient from "../../hooks/useInitializeChatClient";
import {
    ArrowRightToLine,
    Loader2,
    SendHorizontal,
    Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Channel, MessageInput, MessageList, Chat as StreamChat } from "stream-chat-react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

import { ChatMessage } from "./chat-message";
import { CustomMessageInput } from "./custom-message-input";

interface ChatMessage {
    username: string;
    message: string;
    badges?: string[];
}

interface ChatProps {
    streamId: string;
}

export function Chat({ streamId }: ChatProps) {
    const { onChangeChatComponent } = useLiveInfor();
    const { chatClient, chatChannel } = useInitializeChatClient(streamId);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    //dummy data
    const [messages, setMessages] = useState<ChatMessage[]>([
        { username: "lifeisbeautiful7", message: "2400", badges: ["gift"] },
        { username: "Master", message: "1002", badges: ["mod"] },
        { username: "paul", message: "869", badges: ["sub"] },
        { username: "slackerizn", message: "faerie + 7" },
        { username: "MightyHorst", message: "Soju TROOBIS" },
        { username: "grimlyjuicer", message: "Soju troobis" },
        { username: "Gigawawa", message: "Soju" },
        { username: "nahvi_", message: "TROOBIS" },
        { username: "attackontower", message: "so you admit it" },
        {
            username: "psiae",
            message: "test cái message nàyyyyxxxxxxxxyyyyy bdjnckn  ne",
        },
        {
            username: "psiae",
            message: "test cái message nàyyyyxxxxxxxxyyyyy bdjnckn  ne",
        },
        {
            username: "psiae",
            message: "test cái message nàyyyyxxxxxxxxyyyyyyyy bdjnckn  ne",
        },
    ]);

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
            <div className="flex justify-between border-b border-gray-700 p-2">
                <TooltipModel content="Collapse" side="bottom">
                    <button onClick={onChangeChatComponent}>
                        <ArrowRightToLine />
                    </button>
                </TooltipModel>
                <p className="text-lg font-semibold">Live chat</p>
                <Settings />
            </div>
            {chatClient && chatChannel ? (
                <StreamChat client={chatClient}>
                    <Channel channel={chatChannel}>
                        <MessageList Message={ChatMessage}/>
                        <ScrollArea
                            ref={scrollAreaRef}
                            className="h-[calc(100vh-12rem)] px-4"
                        >
                            {/* <div className="flex flex-col space-y-2 py-2">
                                {messages.map((msg, index) => (
                                    <ChatMessage
                                        key={index}
                                        avatar="/user.svg"
                                        message={msg.message}
                                        userName={msg.username}
                                    />
                                ))}
                            </div> */}
                        </ScrollArea>
                        <MessageInput Input={CustomMessageInput}/>
                        
                    </Channel>
                </StreamChat>
            ) : (
                <Loader2 className="mx-auto my-3 animate-spin" />
            )}
        </div>
    );
}
