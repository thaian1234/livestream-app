import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
    avatar: string;
    userName: string;
    message: string;
    // Add more props if needed...
}
export function ChatMessage() {
    return (
        <div className="flex w-full items-start space-x-2">
            <button>
                <Avatar className="h-7 w-7">
                    <AvatarImage src={avatar} alt={userName} />
                    <AvatarFallback />
                </Avatar>
            </button>
            <div>
                <div className="text-sm text-teal-2">{userName}</div>
                <div className="mr-2 text-sm">{message}</div>
            </div>
        </div>
    );
}
