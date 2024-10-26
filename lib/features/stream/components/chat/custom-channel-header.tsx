import { ArrowRightToLine, Settings } from "lucide-react";
import { useChannelStateContext } from "stream-chat-react";

import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { TooltipModel } from "@/components/tooltip-model";

export const CustomChannelHeader = () => {
    const {} = useChannelStateContext();
    const { onChangeChatComponent } = useLiveInfor();
    return (
        <div className="flex justify-between border-b border-gray-700 p-2">
            <TooltipModel content="Collapse" side="bottom">
                <button onClick={onChangeChatComponent}>
                    <ArrowRightToLine />
                </button>
            </TooltipModel>
            <p className="text-lg font-semibold">Live chat</p>
            <Settings />
        </div>
    );
};
