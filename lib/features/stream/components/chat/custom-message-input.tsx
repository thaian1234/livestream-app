import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { useMessageInputContext } from "stream-chat-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ChatInfo } from "./chat-info";

interface CustomMessageInputProps {
    isChatDelayed?: boolean;
    isChatEnabled?: boolean;
    isChatFollowersOnly?: boolean;
    isFollowing?: boolean;
    isHost?: boolean;
}

export const CustomMessageInput = ({
    isChatDelayed = false,
    isChatEnabled = true,
    isChatFollowersOnly = false,
    isFollowing = false,

    isHost = false,
}: CustomMessageInputProps) => {
    const { text, handleChange, handleSubmit } = useMessageInputContext();
    const [isDelayBlock, setIsDelayBlock] = useState(false);

    const isChatDisabled =
        !isHost &&
        (!isChatEnabled ||
            (isChatFollowersOnly && !isFollowing) ||
            isDelayBlock);

    const handleMessageSubmit = () => {
        if (isChatDisabled) return;

        if (isChatDelayed && !isDelayBlock) {
            setIsDelayBlock(true);
            setTimeout(() => {
                setIsDelayBlock(false);
                handleSubmit();
            }, 3000);
        } else {
            handleSubmit();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            handleMessageSubmit();
        }
    };

    return (
        <>
            <ChatInfo
                isDelayed={isChatDelayed}
                isFollowersOnly={isChatFollowersOnly}
            />
            <div className="flex border-t border-gray-700 p-2">
                <Textarea
                    placeholder="Your message"
                    className="min-h-8 resize-none overflow-hidden bg-transparent py-2"
                    value={text}
                    onChange={handleChange}
                    rows={1}
                    onKeyDown={handleKeyDown}
                    disabled={isChatDisabled}
                    maxLength={50}
                />
                <Button
                    variant="ghost"
                    className="ml-2 p-2"
                    onClick={handleMessageSubmit}
                    disabled={isChatDisabled}
                >
                    <SendHorizontal />
                </Button>
            </div>
        </>
    );
};
