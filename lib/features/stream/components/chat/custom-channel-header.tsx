import { ArrowRightToLine, Globe, User, Users } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { ChatStatus, useLiveInfor } from "@/lib/stores/store-live-infor";
import { useViewerId } from "@/lib/stores/store-viewer-id-chat";
import { cn } from "@/lib/utils";

import { TooltipModel } from "@/components/tooltip-model";

interface CustomChannelHeaderProps {
    isHost: boolean;
}
export function CustomChannelHeader({ isHost }: CustomChannelHeaderProps) {
    const {
        onToggleChatComponent,
        onChangeChatStatus,
        chatStatus,
        onTogglePrivateChat,
        isOpenPrivateChat,
    } = useLiveInfor();
    const { setViewerId } = useViewerId();
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
            <div className="flex items-center space-x-3">
                <TooltipModel content="Community" side="bottom">
                    <button
                        onClick={() => {
                            onTogglePrivateChat();
                            setViewerId(undefined);
                        }}
                    >
                        {isHost ? (
                            <PrivateChatButtonForHost />
                        ) : (
                            <PrivateChatButtonForViewer />
                        )}
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
                        {chatStatus === ChatStatus.Chat ? <Globe /> : <Users />}
                    </button>
                </TooltipModel>
            </div>
        </div>
    );
}

function PrivateChatButtonForViewer() {
    const { isOpenPrivateChat } = useLiveInfor();

    return (
        <div className="relative">
            <User className={cn("", isOpenPrivateChat ? "text-teal-2" : "")} />
            {/* thêm điều kiện có bao nhiêu tin nhắn chưa đọc */}
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium">
                2
            </span>
        </div>
    );
}

function PrivateChatButtonForHost() {
    const { isOpenPrivateChat } = useLiveInfor();

    return (
        <div className="relative">
            <User className={cn("", isOpenPrivateChat ? "text-teal-2" : "")} />
            {/* thêm điều kiện có bao nhiêu người nhắn chưa đọc */}
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium">
                2
            </span>
        </div>
    );
}
