import { Row } from "@tanstack/react-table";
import {
    EllipsisVertical,
    MessageSquareText,
    Pencil,
    TvMinimalPlay,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { VideoThumbnail } from "@/components/thumbnail";
import { TooltipModel } from "@/components/tooltip-model";

import { OptionsDropdown } from "./options-dropdown";
import { IVideo } from "./studio-columns";

export function VideoCell({ row }: { row: Row<IVideo> }) {
    const router = useRouter();

    return (
        <div className="grid max-w-[400px] grid-cols-[150px_1fr] space-x-2">
            <div>
                <VideoThumbnail thumbnailUrl={row.original.thumbnailUrl} />
            </div>
            <div className="relative">
                <Link
                    href={`/video/${row.original.id}`}
                    className="line-clamp-2 cursor-pointer text-sm text-teal-1 hover:underline"
                >
                    {row.original.title}
                </Link>
                <div className="absolute bottom-0 left-0 right-0 flex items-end">
                    <Button variant="ghost" className="px-2">
                        <TooltipModel content="Details" side="bottom">
                            <Pencil />
                        </TooltipModel>
                    </Button>

                    <Button
                        variant="ghost"
                        className="px-2"
                        onClick={() => {
                            router.push(`/video/${row.original.id}`);
                        }}
                    >
                        <TooltipModel content="View" side="bottom">
                            <TvMinimalPlay />
                        </TooltipModel>
                    </Button>

                    <OptionsDropdown>
                        <Button variant="ghost" className="px-2">
                            <TooltipModel content="Options" side="bottom">
                                <EllipsisVertical />
                            </TooltipModel>
                        </Button>
                    </OptionsDropdown>
                </div>
            </div>
        </div>
    );
}
