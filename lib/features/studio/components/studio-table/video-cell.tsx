import { Row } from "@tanstack/react-table";
import {
    EllipsisVertical,
    MessageSquareText,
    Pencil,
    TvMinimalPlay,
} from "lucide-react";

import { VideoThumbnail } from "@/components/thumbnail";
import { TooltipModel } from "@/components/tooltip-model";

import { IVideo } from "./studio-columns";

export function VideoCell({ row }: { row: Row<IVideo> }) {
    return (
        <div className="grid max-w-[400px] grid-cols-[150px_1fr] space-x-2">
            <div>
                <VideoThumbnail
                    thumbnailUrl={row.original.thumbnailUrl}
                    avatarUrl={row.original.avatarUrl}
                />
            </div>
            <div className="relative">
                <div
                    // href={row.original.videoUrl}
                    className="line-clamp-2 cursor-pointer text-sm text-teal-1 hover:underline"
                >
                    {row.original.name}
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex items-end gap-2">
                    <TooltipModel content="Details" side="bottom">
                        <Pencil />
                    </TooltipModel>
                    <TooltipModel content="Comments" side="bottom">
                        <MessageSquareText />
                    </TooltipModel>
                    <TooltipModel content="View" side="bottom">
                        <TvMinimalPlay />
                    </TooltipModel>
                    <TooltipModel content="Options" side="bottom">
                        <EllipsisVertical />
                    </TooltipModel>
                </div>
            </div>
        </div>
    );
}
