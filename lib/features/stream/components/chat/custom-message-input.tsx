import { SendHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMessageInputContext } from "stream-chat-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const CustomMessageInput = () => {
    const { text, handleChange, handleSubmit } = useMessageInputContext();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    //send message when press enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    //expand textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "inherit";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    return (
        <div className="flex border-t border-gray-700 p-2">
            <Textarea
                ref={textareaRef}
                placeholder="Your message"
                className="min-h-8 resize-none overflow-hidden bg-transparent py-2"
                value={text}
                onChange={handleChange}
                rows={1}
                onKeyDown={handleKeyDown}
            />

            <Button variant="ghost" className="ml-2 p-2" onClick={handleSubmit}>
                <SendHorizontal />
            </Button>
        </div>
    );
};
