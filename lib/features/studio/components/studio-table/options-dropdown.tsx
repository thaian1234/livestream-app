import {
    ArrowDownToLine,
    Cloud,
    CreditCard,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    Trash2,
    User,
    UserPlus,
    Users,
} from "lucide-react";

import { videoApi } from "@/lib/features/video/apis";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OptionsDropdownProps {
    children: React.ReactNode;
    videoId: string;
}
export function OptionsDropdown({ children, videoId }: OptionsDropdownProps) {
    const { mutate: deleteVideo, isPending } =
        videoApi.mutation.useDeleteVideo();
    const handleDeleteVideo = () => {
        deleteVideo({
            param: {
                id: videoId,
            },
        });
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                <DropdownMenuItem>
                    <ArrowDownToLine size={20} />
                    <span>Download</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={handleDeleteVideo}
                    disabled={isPending}
                >
                    <Trash2 size={20} />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
