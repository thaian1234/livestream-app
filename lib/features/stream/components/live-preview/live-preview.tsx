import React from "react";

import { LivePreviewCard } from "./live-preview-card";

export const cardData = [
    {
        id: "1",
        avatar: "/user.svg",
        title: "Total Revenue",
        userName: "Thuy Trang",
        category: " month",
        thumnail: "/user.svg",
        viewers: "15",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Active Users",
        userName: "45678",
        category: "users",
        thumnail: "/user.svg",
        viewers: "5",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "New Signups",
        userName: "1234",
        category: " week",
        thumnail: "/user.svg",
        viewers: "30",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Customer Satisfaction",
        userName: "475",
        category: "reviews",
        thumnail: "/user.svg",
        viewers: "200",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Conversion Rate",
        userName: "3.45",
        category: " week",
        thumnail: "/user.svg",
        viewers: "90",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Average Order Value",
        userName: "78.90",
        category: " month",
        thumnail: "/user.svg",
        viewers: "32",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Bounce Rate",
        userName: "32.8",
        category: "week",
        thumnail: "/user.svg",
        viewers: "12",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Page Load Time",
        userName: "1.2s",
        category: " improvement",
        thumnail: "/user.svg",
        viewers: "357",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Support Tickets",
        userName: "156",
        category: "hours",
        thumnail: "/user.svg",
        viewers: "5457",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Server Uptime",
        userName: "99.99",
        category: "month",
        thumnail: "/user.svg",
        viewers: "5671",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Inventory Turnover",
        userName: "4.5x",
        category: "quarter",
        thumnail: "/user.svg",
        viewers: "5655  ",
    },
    {
        id: "1",
        avatar: "/user.svg",
        title: "Net Promoter Score",
        userName: "72",
        category: "survey",
        thumnail: "/user.svg",
        viewers: "5",
    },
];
interface LivesPreviewProps {
    limit?: number;
}
export function LivesPreview({ limit }: LivesPreviewProps) {
    return (
        <>
            {cardData.slice(0, limit || cardData.length).map((card, index) => (
                <LivePreviewCard
                    key={index}
                    id={card.id}
                    title={card.title}
                    userName={card.userName}
                    thumnail={card.thumnail}
                    category={card.category}
                    viewers={card.viewers}
                    avatar={card.avatar}
                />
            ))}
        </>
    );
}
