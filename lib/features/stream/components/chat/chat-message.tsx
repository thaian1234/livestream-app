import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
    MessageText,
    ReactionSelector,
    ReactionsList,
    SimpleReactionsList,
    useComponentContext,
    useMessageContext,
    useReactionHandler,
    useReactionsFetcher,
} from "stream-chat-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const CustomReactionSelector = () => {
    const { handleReaction, message, threadList } = useMessageContext();
    const { reactionOptions } = useComponentContext();
    if (threadList) return null;
    return (
        <div className="absolute right-0 top-[-40px] z-10 flex flex-row space-x-2 rounded-md bg-white p-1 shadow-md">
            {reactionOptions?.map(({ Component, name, type }) => (
                <button
                    key={type}
                    onClick={(e) => handleReaction(type, e)} // Handle reaction on click
                    title={`React with: ${name}`}
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

    console.log("Group ", message.reaction_groups);
    return (
        <div
            className="flex w-full flex-row"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
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
            {isHovered && <CustomReactionSelector />}
        </div>
    );
}

{
    /* <SimpleReactionsList />   */
}
{
    /* <ReactionSelector />  */
}
{
    /* <CustomMessageUiActions /> */
}
