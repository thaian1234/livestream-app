import { ArrowRightToLine, SendHorizontal, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { TooltipModel } from "@/components/tooltip-model";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

import { ChatMessage } from "./chat-message";

interface ChatMessage {
    username: string;
    message: string;
    badges?: string[];
}
export function LocalChat() {
    const { onChangeChatComponent } = useLiveInfor();
    const [newMessage, setNewMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    const handleSendMessage = () => {
        if (newMessage) {
            setMessages([
                ...messages,
                { username: "You", message: newMessage },
            ]);
            setNewMessage("");
        }
    };

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

    //send message when press enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    //expand textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "inherit";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);

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
            <ScrollArea
                ref={scrollAreaRef}
                className="h-[calc(100vh-12rem)] px-4"
            >
                <div className="flex flex-col space-y-2 py-2">
                    {messages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            avatar="/user.svg"
                            message={msg.message}
                            userName={msg.username}
                        />
                    ))}
                </div>
            </ScrollArea>
            <div className="flex border-t border-gray-700 p-2">
                <Textarea
                    ref={textareaRef}
                    placeholder="Your message"
                    className="min-h-8 resize-none overflow-hidden bg-transparent py-2"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={1}
                    onKeyDown={handleKeyDown}
                />

                <Button
                    variant="ghost"
                    className="hover:bg-white/20"
                    onClick={() => handleSendMessage}
                >
                    <SendHorizontal />
                </Button>
            </div>
        </div>
    );
}
