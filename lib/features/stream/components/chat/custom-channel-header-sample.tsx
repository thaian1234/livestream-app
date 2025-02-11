import { ArrowRightToLine, MessageSquareMore, User, Users } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { ChatStatus, useLiveInfor } from "@/lib/stores/store-live-infor";
import { cn } from "@/lib/utils";

import { TooltipModel } from "@/components/tooltip-model";

interface CustomChannelHeaderSampleProps {
    isHost: boolean;
}
export const CustomChannelHeaderSample = ({
    isHost,
}: CustomChannelHeaderSampleProps) => {
    const {
        onToggleChatComponent,
        onChangeChatStatus,
        chatStatus,
        onToggleCommunity,
        isOpenCommunity,
    } = useLiveInfor();
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
            <p className="text-lg font-semibold">
                {isOpenCommunity ? "COMMUNITY" : chatStatus}
            </p>
            <div className="flex items-center space-x-2">
                <TooltipModel content="Community" side="bottom">
                    <button onClick={onToggleCommunity}>
                        <MessageSquareMore
                            className={cn(
                                "",
                                isOpenCommunity ? "text-teal-2" : "",
                            )}
                        />
                    </button>
                </TooltipModel>

                <TooltipModel
                    content={
                        chatStatus === ChatStatus.Chat ? "Private chat" : "Chat"
                    }
                    side="bottom"
                >
                    <button
                        onClick={() => {
                            onChangeChatStatus(
                                chatStatus === ChatStatus.Chat
                                    ? ChatStatus.PrivateChat
                                    : ChatStatus.Chat,
                            );
                        }}
                        disabled={isHost && chatStatus === ChatStatus.Chat}
                    >
                        {chatStatus === ChatStatus.Chat ? <User /> : <Users />}
                    </button>
                </TooltipModel>
            </div>
        </div>
    );
};
