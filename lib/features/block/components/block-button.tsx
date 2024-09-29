"use client";

import { blockApi } from "../apis";
import { Ban, CircleSlash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface BlockButtonProps {
    blockerId: string;
    blockedId: string;
}

export function BlockButton({ blockerId, blockedId }: BlockButtonProps) {
    const [isBlocking, setisBlocking] = useState(false);
    const { mutate: handleBlockToggle, isPending } =
        blockApi.mutation.useBlockToggle();
    const handleClick = () => {
        setisBlocking(!isBlocking);
        handleBlockToggle({ param: { blockerId, blockedId } });
    };

    return (
        <Button
            variant="outline"
            onClick={handleClick}
            disabled={isPending}
            className={`group relative flex h-10 w-12 items-center justify-center overflow-hidden transition-all duration-300 ease-in-out hover:bg-primary-foreground/90`}
        >
            <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isBlocking ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"} `}
            >
                <CircleSlash2
                    className={`h-5 w-5 text-primary transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:text-red-500`}
                />
            </div>
            <div
                className={`absolute inset-0 flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out ${isBlocking ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"} `}
            >
                <Ban
                    className={`h-5 w-5 text-primary transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:fill-primary group-hover:text-primary`}
                />
            </div>
        </Button>
    );
}
