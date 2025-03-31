import { Row } from "@tanstack/react-table";
import {
    Download,
    EllipsisVertical,
    FileIcon,
    Pencil,
    Trash2,
    Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { useUser } from "@/lib/hooks/use-user";

import { StorageDTO } from "@/server/api/dtos/storage.dto";

import { Button } from "@/components/ui/button";

import { VideoThumbnail } from "@/components/thumbnail";
import { TooltipModel } from "@/components/tooltip-model";

interface StorageCellProps {
    row: Row<StorageDTO.Select>;
}

export function VideoCell({ row }: StorageCellProps) {
    const router = useRouter();

    const handleEditClick = () => {
        // router.replace(
        //     ROUTES.STORAGE_EDIT_PAGE(user.username, row.original.id),
        // );
    };

    const handleFileClick = () => {
        router.replace(ROUTES.STORAGE_PAGE(row.original.id));
    };

    const handleDelete = () => {
        // Implement delete functionality
        console.log("Delete storage:", row.original.id);
    };

    return (
        <div className="grid max-w-[400px] grid-cols-[150px_1fr] space-x-2">
            {/* <div onClick={handleFileClick}>
                <VideoThumbnail thumbnailUrl={row.original.thumbnailUrl} />
            </div> */}
            <div className="flex flex-col justify-between">
                <Link
                    href={`/storage/${row.original.id}`}
                    className="line-clamp-2 cursor-pointer text-sm text-teal-1 hover:underline"
                    onClick={handleEditClick}
                >
                    {row.original.fileName}
                </Link>
                <div className="flex">
                    <TooltipModel content="Edit" side="bottom">
                        <Button
                            variant="ghost"
                            className="px-2"
                            onClick={handleEditClick}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </TooltipModel>

                    <TooltipModel content="Delete" side="bottom">
                        <Button
                            variant="ghost"
                            className="px-2"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipModel>

                    <TooltipModel content="More options" side="bottom">
                        <Button variant="ghost" className="px-2">
                            <EllipsisVertical className="h-4 w-4" />
                        </Button>
                    </TooltipModel>
                </div>
            </div>
        </div>
    );
}
