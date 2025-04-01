"use client";

import { useState } from "react";

import { Spinner } from "@/components/ui/spinner";

import { DataTablePagination } from "@/components/data-table-pagination";

import { storageApi } from "../../apis";
import { StorageColumns } from "./storage-columns";

export function StorageTable() {
    //phân trang
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const {
        data: storages,
        isLoading,
        isError,
    } = storageApi.query.useGetRecordings({
        page: pageNumber.toString(),
        size: pageSize.toString(),
    });

    if (isLoading || !storages) {
        return <Spinner size={"large"} />;
    }
    if (isError) {
        return <div>Error</div>;
    }
    const totalPages = storages.data.pagination.totalPages;

    return (
        <div className="lg:max-w-[600px] xl:max-w-full">
            <DataTablePagination
                columns={StorageColumns}
                data={storages.data.data}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                totalPages={totalPages}
            />
        </div>
    );
}
