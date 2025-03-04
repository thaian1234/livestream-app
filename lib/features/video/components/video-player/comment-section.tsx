"use client";

import { Loader, SendHorizontal } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
import { EmojiPicker } from "stream-chat-react/emojis";

import { commentApi } from "@/lib/features/comment/apis";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Comment } from "./comment";

export interface IComment {
    id: number;
    user: string;
    avatar: string;
    content: string;
    likes: number;
    timeAgo: string;
}
// const comments = [
//     {
//         id: 1,
//         user: "Jane Doe",
//         avatar: "/placeholder.svg",
//         content:
//             "This playlist is exactly what I needed today. So calming and inspiring!",
//         likes: 24,
//         timeAgo: "2 days ago",
//     },
//     {
//         id: 2,
//         user: "John Smith",
//         avatar: "/placeholder.svg",
//         content:
//             "I've been listening to this on repeat. It's perfect for my meditation sessions.",
//         likes: 18,
//         timeAgo: "1 week ago",
//     },
//     {
//         id: 3,
//         user: "John Smith",
//         avatar: "/placeholder.svg",
//         content:
//             "I've been listening to this on repeat. It's perfect for my meditation sessions.",
//         likes: 18,
//         timeAgo: "1 week ago",
//     },
//     {
//         id: 2,
//         user: "John Smith",
//         avatar: "/placeholder.svg",
//         content:
//             "I've been listening to this on repeat. It's perfect for my meditation sessions.",
//         likes: 18,
//         timeAgo: "1 week ago",
//     },
//     {
//         id: 2,
//         user: "John Smith",
//         avatar: "/placeholder.svg",
//         content:
//             "I've been listening to this on repeat. It's perfect for my meditation sessions.",
//         likes: 18,
//         timeAgo: "1 week ago",
//     },
//     {
//         id: 2,
//         user: "John Smith",
//         avatar: "/placeholder.svg",
//         content:
//             "I've been listening to this on repeat. It's perfect for my meditation sessions. I've been listening to this on repeat. It's perfect for my meditation sessions. I've been listening to this on repeat. It's perfect for my meditation sessions. I've been listening to this on repeat. It's perfect for my meditation sessions. I've been listening to this on repeat. It's perfect for my meditation sessions. I've been listening to this on repeat. It's perfect for my meditation sessions. I've been listening to this on repeat. It's perfect for my meditation sessions. I've been listening to this on repeat. It's perfect for my meditation sessions. I've been listening to this on repeat. It's perfect for my meditation sessions.",
//         likes: 18,
//         timeAgo: "1 week ago",
//     },
// ];

type ParamsType = {
    videoId: string;
};

export function CommentSection() {
    const { videoId } = useParams<ParamsType>();
    const [newComment, setNewComment] = useState("");
    const { data, isPending, error } = commentApi.query.useGetComments(videoId);
    const { mutate: createComment } = commentApi.mutation.useCreateComment();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            handleMessageSubmit();
        }
    };

    const handleMessageSubmit = () => {
        createComment(
            {
                json: {
                    videoId: videoId,
                    content: newComment,
                },
            },
            {
                onSuccess() {
                    setNewComment("");
                },
            },
        );
    };

    if (!!error) {
        redirect("/");
    }

    if (!data || isPending) {
        return <Loader />;
    }

    const comments = data.data.comments;
    const total = data.data.totalRecords;
    return (
        <div className="mx-2 mt-6">
            <h2 className="mb-2 text-xl font-semibold">Comments ({total})</h2>
            <div className="flex items-center border-t border-input py-4">
                <Textarea
                    placeholder="Add a comment..."
                    className="min-h-8 resize-none overflow-hidden bg-transparent py-2"
                    // value={text}
                    onChange={(e) => setNewComment(e.target.value)}
                    value={newComment}
                    onKeyDown={handleKeyDown}
                    maxLength={50}
                />
                {/* <EmojiPicker
                    buttonClassName="h-8 w-8 mt-1 rounded-md fill-white ml-2 hover:bg-accent disabled:opacity-50e"
                    pickerProps={{ theme: "light" }}
                /> */}
                <Button
                    variant="ghost"
                    className="ml-2 p-2"
                    onClick={handleMessageSubmit}
                    type="submit"
                >
                    <SendHorizontal />
                </Button>
            </div>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <Comment key={comment.id} data={comment} />
                ))}
            </div>
        </div>
    );
}
