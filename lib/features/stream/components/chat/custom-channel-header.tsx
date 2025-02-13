import { ArrowRightToLine, MessageSquareMore, User, Users } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { ChatStatus, useLiveInfor } from "@/lib/stores/store-live-infor";
import { cn } from "@/lib/utils";

import { TooltipModel } from "@/components/tooltip-model";

export const CustomChannelHeader = () => {
    const {
        onToggleChatComponent,
        onChangeChatStatus,
        chatStatus,
        onTogglePrivateChat,
        isOpenPrivateChat,
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
                {isOpenPrivateChat ? "PRIVATE CHAT" : chatStatus}
            </p>
            <div className="flex items-center space-x-2">
                <TooltipModel content="Community" side="bottom">
                    <button onClick={onTogglePrivateChat}>
                        <User
                            className={cn(
                                "",
                                isOpenPrivateChat ? "text-teal-2" : "",
                            )}
                        />
                    </button>
                </TooltipModel>

                <TooltipModel
                    content={
                        chatStatus === ChatStatus.Chat ? "Community" : "Chat"
                    }
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
                            <MessageSquareMore />
                        ) : (
                            <Users />
                        )}
                    </button>
                </TooltipModel>
            </div>
        </div>
    );
};
