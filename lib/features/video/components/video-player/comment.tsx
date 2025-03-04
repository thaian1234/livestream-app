"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { UserAvatar } from "@/components/user-avatar";

import { IComment } from "./comment-section";
import { CommentDTO } from "@/server/api/dtos/comment.dto";
import { formatTime, timeAgo } from "@/lib/helpers/formatData";

export function Comment({ data }: { data: CommentDTO.CommentWithUser }) {
    const [isShowMore, setIsShowMore] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (textRef.current) {
            const lineHeight = parseFloat(
                getComputedStyle(textRef.current).lineHeight,
            );
            const maxHeight = lineHeight * 4; // Tối đa 4 dòng
            setIsOverflowing(textRef.current.scrollHeight > maxHeight);
        }
    }, [data.content]);
    return (
        <div className="flex gap-4">
            <UserAvatar imageUrl={data.user.imageUrl} />
            <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium">{data.user.username}</span>
                    <span className="text-sm text-gray-400">
                        {timeAgo(new Date(data.createdAt))}
                    </span>
                </div>
                <p
                    ref={textRef}
                    className={cn("text-sm", isShowMore ? "" : "line-clamp-4")}
                >
                    {data.content}
                </p>
                {isOverflowing && (
                    <Button
                        variant="link"
                        className="m-0 text-sm text-gray-400"
                        onClick={() => setIsShowMore(!isShowMore)}
                    >
                        {isShowMore ? "Show less" : "Show more"}
                    </Button>
                )}
            </div>
        </div>
    );
}
