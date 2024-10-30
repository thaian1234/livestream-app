import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessageContext } from "stream-chat-react";

export function ChatMessage() {
    const {isMyMessage, message} = useMessageContext();
    return (
        <div className="flex w-full items-center space-x-2">
            <button>
                <Avatar className="h-7 w-7">
                    <AvatarImage src={message.user?.image} alt={message.user?.name} />
                    <AvatarFallback />
                </Avatar>
            </button>
            <div>
                <div className="text-sm text-teal-2">{isMyMessage() ? 'You' : message.user?.name}</div>
                <div className="mr-2 text-sm">{message.text}</div>
            </div>
        </div>
    );
}
