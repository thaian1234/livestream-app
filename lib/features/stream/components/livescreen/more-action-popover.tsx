import { CircleSlash2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import { blockApi } from "@/lib/features/block/apis";
import { useUser } from "@/lib/hooks/use-user";

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
    const router = useRouter();
    const currentUser = useUser();
    const { mutate: handleBlockToggle, isPending } =
        blockApi.mutation.useBlockToggle();
    const handleClick = () => {
        handleBlockToggle(
            { param: { blockedId: streamer.id } },
            {
                onSuccess: () => {
                    router.replace("/");
                },
                onError: () => {},
            },
        );
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
                <div>
                    <div className="mb-2">
                        <h4 className="font-medium leading-none">Action</h4>
                    </div>
                    {currentUser.user.id !== streamer.id && (
                        <div>
                            <Button
                                onClick={handleClick}
                                variant={"ghost"}
                                className="flex w-full items-center justify-between"
                            >
                                <CircleSlash2 />
                                <p className="text-sm text-muted-foreground">
                                    Block
                                </p>
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
