"use client";

import { blockApi } from "../apis";
import { CircleSlash2, LockOpen } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface BlockButtonProps {
    blockedId: string;
    isBlock: boolean;
}

export function BlockButton({ blockedId, isBlock }: BlockButtonProps) {
    const [isBlocking, setIsBlocking] = useState(isBlock);
    const { mutate: handleBlockToggle, isPending } =
        blockApi.mutation.useBlockToggle();
    const handleClick = () => {
        setIsBlocking(!isBlocking);
        handleBlockToggle({ param: { blockedId } });
    };

    return (
        <Button
            variant="outline"
            onClick={handleClick}
            disabled={isPending}
            className="group relative flex h-10 w-12 items-center justify-center overflow-hidden transition-all duration-300 ease-in-out hover:bg-primary-foreground/90"
        >
            <div
                className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out",
                    isBlocking
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0",
                )}
            >
                <LockOpen className="h-5 w-5 text-primary transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:fill-primary group-hover:text-primary" />
            </div>
            <div
                className={
                    (cn(
                        "absolute inset-0 flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out",
                    ),
                    isBlocking
                        ? "-translate-y-full opacity-0"
                        : "translate-y-0 opacity-100")
                }
            >
                <CircleSlash2 className="h-5 w-5 text-primary transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:text-red-500" />
            </div>
        </Button>
    );
}
