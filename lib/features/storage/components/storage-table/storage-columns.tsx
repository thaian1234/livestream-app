import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Clock } from "lucide-react";

import { formatDateFromString } from "@/lib/helpers/formatData";

import { StorageDTO } from "@/server/api/dtos/storage.dto";

import { Button } from "@/components/ui/button";

import { StatusSelect } from "./status-select";
import { VideoCell } from "./video-cell";

function formatDuration(startTime: string, endTime: string) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationInSeconds = Math.floor((end - start) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);

    if (minutes === 0) {
        const seconds = durationInSeconds % 60;
        return `${seconds} second${seconds !== 1 ? "s" : ""}`;
    } else if (minutes === 1) {
        return "1 minute";
    } else {
        return `${minutes} minutes`;
    }
}

export const StorageColumns: ColumnDef<StorageDTO.Select>[] = [
    {
        accessorKey: "title",
        header: "Name",
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
