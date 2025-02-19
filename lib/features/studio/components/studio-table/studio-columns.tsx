import { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    EyeIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { VideoCell } from "./video-cell";
import { VisibilityCell } from "./visibility-cell";

export interface IVideo {
    id: number;
    name: string;
    avatarUrl: string;
    videoUrl: string;
    thumbnailUrl: string;
    visibility: "Private" | "Unlisted" | "Public";
    date: string;
    views: number;
    comments: number;
    likes: number;
    dislikes: number;
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
        accessorKey: "name",
        header: "Video",
        cell: ({ row }) => <VideoCell row={row} />,
    },
    {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => <VisibilityCell row={row} />,
    },
    {
        //chưa sort được với định dạng dd/mm/yyyy
        accessorKey: "date",
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
    },
    {
        accessorKey: "views",
        header: "Views",
        cell: ({ row }) => (
            <div className="text-right font-medium">
                <div className="flex items-center gap-1">
                    <EyeIcon className="h-4 w-4" />
                    {row.original.views.toLocaleString()}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "likes",
        header: "Likes (vs. dislikes)",
        cell: ({ row }) => (
            <div className="text-right font-medium">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <ThumbsUpIcon className="h-4 w-4" />
                        {row.original.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <ThumbsDownIcon className="h-4 w-4" />
                        {row.original.dislikes.toLocaleString()}
                    </div>
                </div>
            </div>
        ),
    },
];
