import { useRouter } from "next/navigation";
import React from "react";

import { ROUTES } from "@/lib/configs/routes.config";

import { TooltipModel } from "@/components/tooltip-model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CollapseSidebarProps {
    users: {
        id: string;
        username: string;
        imageUrl: string | null;
    }[];
}

export function CollapseSidebar({ users }: CollapseSidebarProps) {
    const router = useRouter();
    const handleNavigate = (username: string) => {
        router.push(ROUTES.STREAM_PAGE(username));
    };

    return (
        <>
            {users.map((item) => (
                <TooltipModel
                    key={item.id}
                    content={item.username}
                    side="right"
                >
                    <button onClick={() => handleNavigate(item.username)}>
                        <Avatar className="mx-auto mb-2 h-10 w-10">
                            <AvatarImage
                                src={item.imageUrl || "/user.svg"}
                                alt={item.username}
                            />
                            <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                    </button>
                </TooltipModel>
            ))}
        </>
    );
}
