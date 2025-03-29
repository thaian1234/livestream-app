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

import { Button } from "@/components/ui/button";

import { VideoThumbnail } from "@/components/thumbnail";
import { TooltipModel } from "@/components/tooltip-model";

import { IStorage } from "../../types/storage";

interface StorageCellProps {
    row: Row<IStorage>;
}

export function VideoCell({ row }: StorageCellProps) {
    const router = useRouter();
    const { user } = useUser();

    const handleEditClick = () => {
        // router.replace(
        //     ROUTES.STORAGE_EDIT_PAGE(user.username, row.original.id),
        // );
    };

    const handleFileClick = () => {
        router.replace(ROUTES.STORAGE_PAGE(row.original.storageId));
    };

    const handleDownload = () => {
        // Implement download functionality
        window.open(row.original.fileUrl, "_blank");
    };

    const handleUpload = () => {
        // Implement upload functionality
        //router.replace(ROUTES.STORAGE_UPLOAD_PAGE(row.original.storageId));
    };

    const handleDelete = () => {
        // Implement delete functionality
        console.log("Delete storage:", row.original.storageId);
    };

    return (
        <div className="grid max-w-[400px] grid-cols-[150px_1fr] space-x-2">
            <div onClick={handleFileClick}>
                <VideoThumbnail thumbnailUrl={row.original.thumbnailUrl} />
            </div>
            <div className="relative">
                <Link
                    href={`/storage/${row.original.storageId}`}
                    className="line-clamp-2 cursor-pointer text-sm text-teal-1 hover:underline"
                    onClick={handleEditClick}
                >
                    {row.original.title}
                </Link>
                <div className="absolute bottom-0 left-0 right-0 flex items-end">
                    <TooltipModel content="Edit" side="bottom">
                        <Button
                            variant="ghost"
                            className="px-2"
                            onClick={handleEditClick}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </TooltipModel>
                    <TooltipModel content="Download" side="bottom">
                        <Button
                            variant="ghost"
                            className="px-2"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </TooltipModel>

                    <TooltipModel content="Upload" side="bottom">
                        <Button
                            variant="ghost"
                            className="px-2"
                            onClick={handleUpload}
                        >
                            <Upload className="h-4 w-4" />
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
