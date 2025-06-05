import { Gift } from "lucide-react";
import { DefaultGenerics } from "stream-chat";
import {
    DefaultStreamChatGenerics,
    EventComponentProps,
} from "stream-chat-react";

export function CustomSystemMessage(
    props: EventComponentProps<DefaultGenerics>,
) {
    const { message } = props;
    const { text } = message;
    if (!text) return;

    const [userName, amount] = text.split(",");

    return (
        <div className="my-2 flex w-full justify-center">
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-4 py-2 text-sm shadow-sm">
                <Gift className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-amber-600">{userName}</span>
                <span>has donated</span>
                <span className="font-bold text-purple-600">{amount}</span>
            </div>
        </div>
    );
}
