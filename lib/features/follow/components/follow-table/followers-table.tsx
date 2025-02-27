"use client";

import { CommunityData, formatCommunityData } from "@/lib/helpers/formatData";

import { DataTable } from "@/components/data-table";

import { columns } from "./columns";

interface FollowersTableProps {
    rawFollowers: CommunityData[] | undefined;
}

export function FollowersTable({ rawFollowers }: FollowersTableProps) {
    const isFollowerState = false;
    const followers =
        rawFollowers?.map((follow) => formatCommunityData(follow)) || [];
    return (
        <DataTable
            columns={columns(isFollowerState)}
            data={followers}
            pageSizeValue={10}
        />
    );
}
