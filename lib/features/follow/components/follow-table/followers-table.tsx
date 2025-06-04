"use client";

import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { CommunityData, formatCommunityData } from "@/lib/helpers/formatData";

import { DataTable } from "@/components/data-table";

import { columns } from "./columns";

interface FollowersTableProps {
    rawFollowers: CommunityData[] | undefined;
}

export function FollowersTable({ rawFollowers }: FollowersTableProps) {
    const isFollowerState = false;
    const router = useRouter();
    const followers =
        rawFollowers?.map((follow) => formatCommunityData(follow)) || [];
    const handleNavigate = (username: string) => {
        router.replace(ROUTES.ABOUT_PAGE(username));
    };
    return (
        <DataTable
            columns={columns(isFollowerState, handleNavigate)}
            data={followers}
            pageSizeValue={10}
        />
    );
}
