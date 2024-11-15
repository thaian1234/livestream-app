import { ArrowRightToLine, MessageSquareMore, Users } from "lucide-react";
import { useChannelStateContext } from "stream-chat-react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { TooltipModel } from "@/components/tooltip-model";

export const CustomChannelHeader = () => {
    const {} = useChannelStateContext();
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
                content={chatStatus === "Chat" ? "Community" : "Chat"}
                side="bottom"
            >
                <button onClick={onChangeChatStatus}>
                    {chatStatus === "Chat" ? <Users /> : <MessageSquareMore />}
                </button>
            </TooltipModel>
        </div>
    );
};
