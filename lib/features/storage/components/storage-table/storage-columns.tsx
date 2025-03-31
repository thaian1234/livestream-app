import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Clock, HardDrive } from "lucide-react";

import { formatDateFromString } from "@/lib/helpers/formatData";
import { formatFileSize } from "@/lib/helpers/formatFileSize";

import { StorageDTO } from "@/server/api/dtos/storage.dto";

import { Button } from "@/components/ui/button";

import { StatusSelect } from "./status-select";
import { VideoCell } from "./video-cell";

function formatDuration(startTime: string, endTime: string) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const duration = Math.floor((end - start) / 1000); // in seconds
    return `${Math.floor(duration / 60)}:${(duration % 60)
        .toString()
        .padStart(2, "0")}`;
}

export const StorageColumns: ColumnDef<StorageDTO.Select>[] = [
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
                {formatDuration(row.original.startTime, row.original.endTime)}
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
        cell: ({ row }) => formatDateFromString(row.original.startTime),
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
