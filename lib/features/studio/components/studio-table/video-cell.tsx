import { Row } from "@tanstack/react-table";
import {
    EllipsisVertical,
    MessageSquareText,
    Pencil,
    TvMinimalPlay,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { useUser } from "@/lib/hooks/use-user";

import { Button } from "@/components/ui/button";

import { VideoThumbnail } from "@/components/thumbnail";
import { TooltipModel } from "@/components/tooltip-model";

import { IVideoStudio } from "../../types/studio";
import { OptionsDropdown } from "./options-dropdown";

export function VideoCell({ row }: { row: Row<IVideoStudio> }) {
    const router = useRouter();
    const { user } = useUser();

    const handleEditClick = () => {
        router.push(ROUTES.VIDEO_EDIT_PAGE(user.username, row.original.id));
    };

    const handleVideoClick = () => {
        window.open(ROUTES.VIDEO_PAGE(row.original.id), "_blank");
    };

    return (
        <div className="grid max-w-[400px] grid-cols-[150px_1fr] space-x-2">
            <div onClick={handleVideoClick}>
                <VideoThumbnail thumbnailUrl={row.original.thumbnailUrl} />
            </div>
            <div className="flex flex-col justify-between">
                <Link
                    href={ROUTES.VIDEO_EDIT_PAGE(
                        user.username,
                        row.original.id,
                    )}
                    prefetch={false}
                    className="line-clamp-2 cursor-pointer text-sm text-teal-1 hover:underline"
                >
                    {row.original.title}
                </Link>
                <div className="flex">
                    <TooltipModel content="Details" side="bottom">
                        <Button
                            variant="ghost"
                            className="px-2"
                            onClick={handleEditClick}
                        >
                            <Pencil />
                        </Button>
                    </TooltipModel>

                    <TooltipModel content="View" side="bottom">
                        <Button
                            variant="ghost"
                            className="px-2"
                            onClick={handleVideoClick}
                        >
                            <TvMinimalPlay />
                        </Button>
                    </TooltipModel>

                    <OptionsDropdown videoId={row.original.id}>
                        <TooltipModel content="Options" side="bottom">
                            <Button variant="ghost" className="px-2">
                                <EllipsisVertical />
                            </Button>
                        </TooltipModel>
                    </OptionsDropdown>
                </div>
            </div>
        </div>
    );
}
