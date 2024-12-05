import React from "react";

import { CategoryDTO } from "@/server/api/dtos/category.dto";

import { LivePreviewCard } from "./live-preview-card";

interface StreamInfo {
    id: string;
    avatar?: string | null | undefined;
    name: string;
    username: string;
    thumbnailUrl: string | null;
    userId: string;
    isLive: boolean;
    categories: CategoryDTO.BasicSelect[];
}

interface LivesPreviewProps {
    limit?: number;
    streams: StreamInfo[];
}
export function LivesPreview({ limit, streams }: LivesPreviewProps) {
    return (
        <>
            {streams.slice(0, limit || streams.length).map((card, index) => (
                <LivePreviewCard
                    key={index}
                    id={card.id}
                    title={card.name}
                    userName={card.username}
                    thumbnail={card.thumbnailUrl}
                    categories={card.categories}
                    viewers={"Chua co viewer"}
                    avatar={card.avatar || ""}
                />
            ))}
        </>
    );
}
