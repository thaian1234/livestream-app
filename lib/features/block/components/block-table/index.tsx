import { blockApi } from "../../apis";

import { ListSkeleton } from "@/lib/components/community/list-skeleton";
import { formatCommunityData } from "@/lib/helpers/formatData";

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
        data.data?.blockeds?.map((block) => formatCommunityData(block)) || [];
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns()} data={blockeds} pageSizeValue={10} />
        </div>
    );
}
