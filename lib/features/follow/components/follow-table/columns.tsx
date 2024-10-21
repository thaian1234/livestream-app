"use client";

import { FollowButton } from "../follow-button";
import { ColumnDef } from "@tanstack/react-table";

import { UserAvatar } from "@/components/user-avatar";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Follow = {
    id: string;
    username: string;
    imageUrl: string | null;
};
const handleNavigate = (id: string) => {
    console.log("Navigate to user profile: " + id);
};
export const columns = (
    idAuth: string,
    isFollowerState: boolean,
): ColumnDef<Follow>[] => [
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => {
            const follow = row.original;
            return (
                <button onClick={() => handleNavigate(follow.id)}>
                    <UserAvatar imageUrl={follow?.imageUrl} />
                </button>
            );
        },
        size: 10,
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => {
            const follow = row.original;
            return (
                <button onClick={() => handleNavigate(follow.id)}>
                    <div>{follow.username}</div>
                </button>
            );
        },
        size: 560,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const follow = row.original;
            return (
                <>
                    {isFollowerState ? (
                        <FollowButton
                            followerId={follow.id}
                            followingId={idAuth}
                        />
                    ) : (
                        <FollowButton
                            followerId={idAuth}
                            followingId={follow.id}
                        />
                    )}
                </>
            );
        },
        size: 50,
    },
];
