"use client";

import { useState } from "react";

import { DataTablePagination } from "@/components/data-table-pagination";

import { dummyStorageData } from "../../types/storage";
import { StorageColumns } from "./storage-columns";

export function StorageTable() {
    //phân trang
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const totalPages = Math.ceil(dummyStorageData.length / pageSize);

    return (
        <div className="lg:max-w-[600px] xl:max-w-full">
            {dummyStorageData ? (
                <DataTablePagination
                    columns={StorageColumns}
                    data={dummyStorageData}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalPages={totalPages}
                />
            ) : null}
        </div>
    );
}
