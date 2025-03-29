import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Clock, HardDrive } from "lucide-react";

import { formatDateFromString } from "@/lib/helpers/formatData";
import { formatFileSize } from "@/lib/helpers/formatFileSize";

import { Button } from "@/components/ui/button";

import { IStorage } from "../../types/storage";
import { StatusSelect } from "./status-select";
import { VideoCell } from "./video-cell";

export const StorageColumns: ColumnDef<IStorage>[] = [
    {
        accessorKey: "title",
        header: "Video",
        cell: ({ row }) => <VideoCell row={row} />,
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.floor(row.original.duration / 60)}:
                {(row.original.duration % 60).toString().padStart(2, "0")}
            </div>
        ),
    },
    {
        accessorKey: "fileSize",
        header: "Size",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <HardDrive className="h-4 w-4" />
                {formatFileSize(row.original.fileSize)}
            </div>
        ),
    },
    {
        accessorKey: "recordedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0 text-sm"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Recorded Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => formatDateFromString(row.original.recordedAt),
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.getValue(columnId));
            const dateB = new Date(rowB.getValue(columnId));
            return dateA.getTime() - dateB.getTime();
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusSelect row={row} />,
    },
];
