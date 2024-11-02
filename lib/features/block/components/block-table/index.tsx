"use client";

import { blockApi } from "../../apis";

import { ListSkeleton } from "@/lib/components/community/list-skeleton";

import { DataTable } from "@/components/data-table";

import { columns } from "./columns";

export function BlockTable() {
    const { data, isPending, error } = blockApi.query.useBlock();
    if (data === undefined || isPending) {
        return <ListSkeleton />;
    }
    if (error) {
        return <p>Some thing went wrong</p>;
    }
    const blockeds =
        data.data?.blockeds?.map((block) => {
            const formattedDate = new Date(block.createdAt).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                },
            );

            return {
                id: block.id,
                username: block.username,
                imageUrl: block.imageUrl,
                createdAt: formattedDate,
            };
        }) || [];
    return <DataTable columns={columns()} data={blockeds} pageSizeValue={10} />;
}
