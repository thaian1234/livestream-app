import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const avatarSizes = cva("", {
    variants: {
        size: {
            default: "size-10",
            lg: "size-14",
            xxl: "size-28",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
    imageUrl: string | null;
    isLive?: boolean;
}

export function UserAvatar({
    imageUrl,
    isLive = false,
    size = "default",
}: UserAvatarProps) {
    const userImage = imageUrl !== null ? imageUrl : undefined;

    return (
        <div className="flex items-center justify-center space-x-4">
            <Avatar
                className={cn(
                    "border-2 border-white ring-2",
                    isLive && "border-background ring-2 ring-rose-500",
                    avatarSizes({ size }),
                )}
            >
                <AvatarImage src={userImage} className="object-cover" />
                <AvatarFallback />
            </Avatar>
        </div>
    );
}
