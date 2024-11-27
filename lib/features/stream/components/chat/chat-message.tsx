import { useState } from "react";
import { useComponentContext, useMessageContext } from "stream-chat-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CustomReactionsList = () => {
    const { message } = useMessageContext();
    const { reactionOptions } = useComponentContext();

    const reactionGroups = Object.entries(message?.reaction_counts || {}).sort(
        ([, countA], [, countB]) => countB - countA, // Descending order by count
    );

    console.log(message.reaction_groups);

    if (Object.keys(reactionGroups).length === 0) {
        return null;
    }

    return (
        <div className="flex flex-row items-center space-x-2 rounded-md px-2 pb-1 shadow">
            {reactionGroups.map(([type, count]) => {
                const reactionOption = reactionOptions?.find(
                    (reaction) => reaction.type === type,
                );
                if (!reactionOption) return null;
                return (
                    <div
                        key={type}
                        className="flex items-center space-x-1 rounded-full text-sm shadow-sm"
                    >
                        <span className="reaction-emoji">
                            <reactionOption.Component />
                        </span>
                        <span className="font-medium text-gray-700">
                            {count}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const CustomReactionSelector = () => {
    const { handleReaction, threadList } = useMessageContext();
    const { reactionOptions } = useComponentContext();
    if (threadList) return null;
    return (
        <div className="absolute right-0 z-10 flex flex-row space-x-2 rounded-md shadow-md">
            {reactionOptions?.map(({ Component, name, type }) => (
                <button
                    key={type}
                    onClick={(e) => handleReaction(type, e)}
                    title={name}
                >
                    <Component />
                </button>
            ))}
        </div>
    );
};

export function ChatMessage() {
    const { isMyMessage, message } = useMessageContext();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative flex w-full flex-row"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div>
                <div className="flex w-full items-center space-x-2">
                    <button>
                        <Avatar className="h-7 w-7">
                            <AvatarImage
                                src={message.user?.image}
                                alt={message.user?.name}
                            />
                            <AvatarFallback />
                        </Avatar>
                    </button>
                    <div>
                        <div className="text-sm text-teal-2">
                            {isMyMessage() ? "You" : message.user?.name}
                        </div>
                        <div className="mr-2 text-sm">{message.text}</div>
                    </div>
                </div>
                <CustomReactionsList />
            </div>
            {isHovered && <CustomReactionSelector />}
        </div>
    );
}
