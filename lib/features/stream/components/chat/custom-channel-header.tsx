import { ArrowRightToLine, MessageSquareMore, Users } from "lucide-react";

import { ChatStatus, useLiveInfor } from "@/lib/stores/store-live-infor";

import { TooltipModel } from "@/components/tooltip-model";

export const CustomChannelHeader = () => {
    const { onToggleChatComponent, onChangeChatStatus, chatStatus } =
        useLiveInfor();
    return (
        <div className="flex justify-between border-b border-gray-700 p-2">
            <TooltipModel content="Collapse" side="bottom">
                <button onClick={onToggleChatComponent}>
                    <ArrowRightToLine />
                </button>
            </TooltipModel>
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
