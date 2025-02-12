"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { ImageUrlType } from "@/lib/types";

import { Button } from "@/components/ui/button";

import { UserAvatar } from "@/components/user-avatar";

import { FollowButton } from "../follow-button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Follow = {
    id: string;
    username: string;
    imageUrl: ImageUrlType;
    createdAt: string;
};

const handleNavigate = (id: string) => {
    console.log("Navigate to user profile: " + id);
};
export const columns = (isFollowerState: boolean): ColumnDef<Follow>[] => [
    {
        id: "avatar",
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
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
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Follow date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const follow = row.original;
            return <div className="ml-6">{follow.createdAt}</div>;
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
                            followingId={follow.id}
                            isFollowed={isFollowerState}
                        />
                    ) : (
                        <></>
                    )}
                </>
            );
        },
        size: 50,
    },
];
