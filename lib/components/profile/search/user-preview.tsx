import React from "react";

import { UserPreviewCard } from "./user-preview-card";

interface UserInfo {
    id: string;
    username: string;
    imageUrl: string | null;
    followerCount: number;
    bio: string | null;
    isLive: boolean;
    isFollow: boolean;
}

interface UserPreviewProps {
    limit?: number;
    users: UserInfo[];
}

export function UserPreview({ limit, users }: UserPreviewProps) {
    return (
        <>
            {users.slice(0, limit || users.length).map((user, index) => (
                <UserPreviewCard
                    key={index}
                    id={user.id}
                    username={user.username}
                    imageUrl={user.imageUrl}
                    followers={user.followerCount}
                    isLive={user.isLive}
                    isFollow={user.isFollow}
                />
            ))}
        </>
    );
}
