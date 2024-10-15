import React from "react";

import { UserPreviewCard } from "./user-preview-card";

const dataUser = [
    {
        id: "1",
        username: "userrrr",
        imageUrl: "/user.svg",
        followers: 1200,
    },
    {
        id: "1",
        username: "userr",
        imageUrl: "/user.svg",
        followers: 1000,
    },
    { id: "1", username: "user3", imageUrl: "/user.svg", followers: 800 },
    { id: "1", username: "user4", imageUrl: "/user.svg", followers: 700 },
    { id: "1", username: "user4", imageUrl: "/user.svg", followers: 700 },
    { id: "1", username: "user4", imageUrl: "/user.svg", followers: 700 },
    { id: "1", username: "user4", imageUrl: "/user.svg", followers: 700 },
    { id: "1", username: "user4", imageUrl: "/user.svg", followers: 700 },
];

interface UserPreviewProps {
    limit?: number;
}

export function UserPreview({ limit }: UserPreviewProps) {
    return (
        <>
            {dataUser.slice(0, limit || dataUser.length).map((user, index) => (
                <UserPreviewCard
                    key={index}
                    id={user.id}
                    username={user.username}
                    imageUrl={user.imageUrl}
                    followers={user.followers}
                />
            ))}
        </>
    );
}
