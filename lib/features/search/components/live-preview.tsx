import React from "react";

import { LivePreviewCard } from "./live-preview-card";

export const cardData = [
    {
        id: "1",
        avatar: "/user.svg",
        title: "Total Revenue",
        userName: "Thuy Trang",
        category: " month",
        thumbnail: "/user.svg",
        viewers: "15",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Active Users",
        userName: "45678",
        category: "users",
        thumbnail: "/user.svg",
        viewers: "5",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "New Signups",
        userName: "1234",
        category: " week",
        thumbnail: "/user.svg",
        viewers: "30",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Customer Satisfaction",
        userName: "475",
        category: "reviews",
        thumbnail: "/user.svg",
        viewers: "200",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Conversion Rate",
        userName: "3.45",
        category: " week",
        thumbnail: "/user.svg",
        viewers: "90",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Average Order Value",
        userName: "78.90",
        category: " month",
        thumbnail: "/user.svg",
        viewers: "32",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Bounce Rate",
        userName: "32.8",
        category: "week",
        thumbnail: "/user.svg",
        viewers: "12",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Page Load Time",
        userName: "1.2s",
        category: " improvement",
        thumbnail: "/user.svg",
        viewers: "357",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Support Tickets",
        userName: "156",
        category: "hours",
        thumbnail: "/user.svg",
        viewers: "5457",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Server Uptime",
        userName: "99.99",
        category: "month",
        thumbnail: "/user.svg",
        viewers: "5671",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Inventory Turnover",
        userName: "4.5x",
        category: "quarter",
        thumbnail: "/user.svg",
        viewers: "5655  ",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Net Promoter Score",
        userName: "72",
        category: "survey",
        thumbnail: "/user.svg",
        viewers: "5",
    },
];

interface StreamInfo {
    id: string;
    avatar?: string | null | undefined;
    name: string;
    username: string;
    // category: string;
    thumbnailUrl: string | null;
    // viewers: string;
    userId: string;
    isLive: boolean;
}

interface LivesPreviewProps {
    limit?: number;
    streams: StreamInfo[];
}
export function LivesPreview({ limit, streams }: LivesPreviewProps) {
    return (
        <>
            {streams.slice(0, limit || cardData.length).map((card, index) => (
                <LivePreviewCard
                    key={index}
                    id={card.id}
                    title={card.name}
                    userName={card.username}
                    thumbnail={card.thumbnailUrl || "/user.svg"}
                    category={"Chua co category"}
                    viewers={"Chua co viewer"}
                    avatar={card.avatar || ""}
                />
            ))}
        </>
    );
}
