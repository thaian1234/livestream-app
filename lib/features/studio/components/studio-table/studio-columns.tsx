import { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    EyeIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
} from "lucide-react";

import { formatDateFromString } from "@/lib/helpers/formatData";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { VideoCell } from "./video-cell";
import { VisibilityCell } from "./visibility-cell";

export interface IVideo {
    id: string;
    userId: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string | null;
    visibility: "public" | "private" | "followers_only" | "unlisted";
    createdAt: string;
    viewCount: number;
    // comments: number;
    likeCount: number;
    dislikeCount: number;
}

export const StudioColumns: ColumnDef<IVideo>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),

        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Video",
        cell: ({ row }) => <VideoCell row={row} />,
    },
    {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => <VisibilityCell row={row} />,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return formatDateFromString(row.original.createdAt);
        },
    },
    {
        accessorKey: "viewCount",
        header: "Views",
        cell: ({ row }) => (
            <div className="text-right font-medium">
                <div className="flex items-center gap-1">
                    <EyeIcon className="h-4 w-4" />
                    {row.original.viewCount.toLocaleString()}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "likeCount",
        header: "Likes (vs. dislikes)",
        cell: ({ row }) => (
            <div className="text-right font-medium">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <ThumbsUpIcon className="h-4 w-4" />
                        {row.original.likeCount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <ThumbsDownIcon className="h-4 w-4" />
                        {row.original.dislikeCount.toLocaleString()}
                    </div>
                </div>
            </div>
        ),
    },
];
