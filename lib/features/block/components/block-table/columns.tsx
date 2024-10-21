"use client";

import { BlockButton } from "../block-button";
import { ColumnDef } from "@tanstack/react-table";

import { useUser } from "@/lib/hooks/use-user";

import { UserAvatar } from "@/components/user-avatar";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Block = {
    id: string;
    username: string;
    imageUrl: string | null;
};
const handleNavigate = (id: string) => {
    console.log("Navigate to user profile: " + id);
};
export const columns = (idAuth: string): ColumnDef<Block>[] => [
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => {
            const block = row.original;
            return (
                <button onClick={() => handleNavigate(block.id)}>
                    <UserAvatar imageUrl={block?.imageUrl} />
                </button>
            );
        },
        size: 10,
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => {
            const block = row.original;
            return (
                <button onClick={() => handleNavigate(block.id)}>
                    <div>{block.username}</div>
                </button>
            );
        },
        size: 560,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const block = row.original;
            return <BlockButton blockedId={block.id} blockerId={idAuth} />;
        },
        size: 50,
    },
];
