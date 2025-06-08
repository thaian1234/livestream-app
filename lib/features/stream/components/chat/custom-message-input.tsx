import { Gift, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { useMessageInputContext } from "stream-chat-react";
import { EmojiPicker } from "stream-chat-react/emojis";

import { DonateDialog } from "@/lib/features/donation/components/donate-dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ChatInfo } from "./chat-info";

interface CustomMessageInputProps {
    isChatDelayed?: boolean;
    isChatEnabled?: boolean;
    isChatFollowersOnly?: boolean;
    isFollowing?: boolean;
    isHost?: boolean;
    streamerId?: string;
}

export const CustomMessageInput = ({
    isChatDelayed = false,
    isChatEnabled = true,
    isChatFollowersOnly = false,
    isFollowing = false,
    isHost = false,
    streamerId,
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
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-black-1 sm:static sm:block sm:bg-transparent">
            <ChatInfo
                isDelayed={isChatDelayed}
                isFollowersOnly={isChatFollowersOnly}
            />
            <div className="space-y-2 border-t border-gray-700 p-2">
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
                <div className="flex items-center justify-between">
                    <DonateDialog streamerId={streamerId}>
                        <Button variant="ghost" className="p-2">
                            <Gift className="h-6 w-6" />
                        </Button>
                    </DonateDialog>
                    <div className="flex items-center">
                        <EmojiPicker
                            buttonClassName="h-10 w-10 p-2   rounded-md fill-white hover:bg-accent hover:fill-teal-2 disabled:opacity-50e"
                            pickerProps={{ theme: "light" }}
                        />

                        <Button
                            variant="ghost"
                            className="p-2"
                            onClick={handleMessageSubmit}
                            disabled={isChatDisabled}
                        >
                            <SendHorizontal className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
