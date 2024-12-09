import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { blockApi } from "@/lib/features/block/apis";
import { BlockButton } from "@/lib/features/block/components/block-button";

import { UserDTO } from "@/server/api/dtos/user.dto";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface MoreActionProps {
    streamer: UserDTO.Select;
}

export function MoreActionPopover({ streamer }: MoreActionProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="border border-slate-400">
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 px-2">
                <BlockButton
                    blockedId={streamer.id}
                    isBlock={false}
                    showText={true}
                    redirectTo={ROUTES.HOME_PAGE}
                />
            </PopoverContent>
        </Popover>
    );
}
