"use client";

import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { CommunityData, formatCommunityData } from "@/lib/helpers/formatData";

import { DataTable } from "@/components/data-table";

import { columns } from "./columns";

interface FollowingsTableProps {
    rawFollowings: CommunityData[] | undefined;
}

export function FollowingsTable({ rawFollowings }: FollowingsTableProps) {
    const isFollowerState = true;
    const router = useRouter();
    const following =
        rawFollowings?.map((follow) => formatCommunityData(follow)) || [];
    const handleNavigate = (username: string) => {
        router.replace(ROUTES.ABOUT_PAGE(username));
    };
    return (
        <DataTable
            columns={columns(isFollowerState, handleNavigate)}
            data={following}
            pageSizeValue={10}
        />
    );
}
