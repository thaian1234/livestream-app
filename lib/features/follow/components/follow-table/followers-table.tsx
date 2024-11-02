"use client";

import { followApi } from "../../apis";

import { ListSkeleton } from "@/lib/components/community/list-skeleton";

import { DataTable } from "@/components/data-table";

import { columns } from "./columns";

export function FollowersTable() {
    const isFollowerState = false;
    const { data, isPending, error } = followApi.query.useFollow();
    if (data === undefined || isPending) {
        return <ListSkeleton />;
    }
    if (error) {
        return <p>Some thing went wrong</p>;
    }
    const followers =
        data.data?.followers?.map((follow) => {
            const formattedDate = new Date(follow.createdAt).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                },
            );

            return {
                id: follow.id,
                username: follow.username,
                imageUrl: follow.imageUrl,
                createdAt: formattedDate,
            };
        }) || [];
    return (
        <DataTable
            columns={columns(isFollowerState)}
            data={followers}
            pageSizeValue={10}
        />
    );
}
