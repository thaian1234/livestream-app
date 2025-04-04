"use client";

import { CommunityData, formatCommunityData } from "@/lib/helpers/formatData";

import { DataTable } from "@/components/data-table";

import { columns } from "./columns";

interface FollowingsTableProps {
    rawFollowings: CommunityData[] | undefined;
}

export function FollowingsTable({ rawFollowings }: FollowingsTableProps) {
    const isFollowerState = true;
    const following =
        rawFollowings?.map((follow) => formatCommunityData(follow)) || [];
    return (
        <DataTable
            columns={columns(isFollowerState)}
            data={following}
            pageSizeValue={10}
        />
    );
}
