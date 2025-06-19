import { Row } from "@tanstack/react-table";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { StorageDTO } from "@/server/api/dtos/storage.dto";

import { Button } from "@/components/ui/button";

import { TooltipModel } from "@/components/tooltip-model";

import { storageApi } from "../../apis";

interface StorageCellProps {
    row: Row<StorageDTO.Select>;
}

export function VideoCell({ row }: StorageCellProps) {
    const storageMutation = storageApi.mutation.useDeleteRecording();

    const handleEditClick = () => {};

    const handleFileClick = () => {};

    const handleDelete = () => {
        storageMutation.mutate({
            param: {
                id: row.original.id,
            },
        });
    };

    return (
        <div className="grid max-w-[400px] grid-cols-[150px_1fr] space-x-2">
            <div className="flex flex-col justify-between">
                <Link
                    href={row.original.fileUrl || ""}
                    prefetch={false}
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
                            disabled={storageMutation.isPending}
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
