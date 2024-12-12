import { ArrowRightToLine, MessageSquareMore, Users } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { ChatStatus, useLiveInfor } from "@/lib/stores/store-live-infor";

import { TooltipModel } from "@/components/tooltip-model";

export const CustomChannelHeader = () => {
    const { onToggleChatComponent, onChangeChatStatus, chatStatus } =
        useLiveInfor();
    const desktopScreen = useMediaQuery("(min-width: 1280px)");

    return (
        <div className="flex justify-between border-b border-gray-700 p-2">
            {desktopScreen ? (
                <TooltipModel content="Collapse" side="bottom">
                    <button onClick={onToggleChatComponent}>
                        <ArrowRightToLine />
                    </button>
                </TooltipModel>
            ) : (
                <div></div>
            )}
            <p className="text-lg font-semibold">{chatStatus}</p>
            <TooltipModel
                content={chatStatus === ChatStatus.Chat ? "Community" : "Chat"}
                side="bottom"
            >
                <button
                    onClick={() => {
                        onChangeChatStatus(
                            chatStatus === ChatStatus.Chat
                                ? ChatStatus.Community
                                : ChatStatus.Chat,
                        );
                    }}
                >
                    {chatStatus === ChatStatus.Chat ? (
                        <Users />
                    ) : (
                        <MessageSquareMore />
                    )}
                </button>
            </TooltipModel>
        </div>
    );
};
