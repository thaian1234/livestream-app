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

type ParamsType = {
    videoId: string;
};

export function CommentSection() {
    const params = useParams<ParamsType>();
    const [newComment, setNewComment] = useState("");
    const { data, isPending, error } = commentApi.query.useGetComments(
        params?.videoId || "",
    );
    const { mutate: createComment } = commentApi.mutation.useCreateComment();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            handleMessageSubmit();
        }
    };

    if (!!error || !params?.videoId) {
        redirect("/");
    }

    if (!data || isPending) {
        return <Loader />;
    }

    const handleMessageSubmit = () => {
        createComment(
            {
                json: {
                    videoId: params.videoId,
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
