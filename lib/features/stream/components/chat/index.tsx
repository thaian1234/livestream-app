import useInitializeChatClient from "../../hooks/useInitializeChatClient";
import {
    ArrowRightToLine,
    Loader2,
    SendHorizontal,
    Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    DefaultGenerics,
    Channel as TypeChannel,
    StreamChat as TypeStreamChat,
} from "stream-chat";
import {
    Channel,
    Message,
    MessageInput,
    MessageList,
    Chat as StreamChat,
    VirtualizedMessageList,
    Window,
} from "stream-chat-react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

import { ChatMessage } from "./chat-message";
import { CustomMessageInput } from "./custom-message-input";

interface ChatMessage {
    username: string;
    message: string;
    badges?: string[];
}

export function Chat() {
    const { onChangeChatComponent } = useLiveInfor();
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
        <div className="flex h-80 w-[500px] flex-col justify-between rounded-xl border border-gray-700 bg-transparent text-white">
            <div className="flex justify-between border-b border-gray-700 p-2">
                <TooltipModel content="Collapse" side="bottom">
                    <button onClick={onChangeChatComponent}>
                        <ArrowRightToLine />
                    </button>
                </TooltipModel>
                <p className="text-lg font-semibold">Live chat</p>
                <Settings />
            </div>
            <ScrollArea ref={scrollAreaRef} className="px-4">
                <MessageList
                    internalInfiniteScrollProps={{}}
                    showUnreadNotificationAlways={false}
                    disableDateSeparator={false}
                    Message={ChatMessage}
                />
            </ScrollArea>
            <MessageInput Input={CustomMessageInput} />
        </div>
    );
}
