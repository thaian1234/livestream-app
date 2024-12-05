"use client";

import { blockApi } from "../apis";
import { CircleSlash2, LockOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlockButtonProps {
    blockedId: string;
    isBlock: boolean;
    showText?: boolean;
    redirectTo?: string;
}

export function BlockButton({
    blockedId,
    isBlock,
    showText = false,
    redirectTo,
}: BlockButtonProps) {
    const router = useRouter();
    const [isBlocking, setIsBlocking] = useState(isBlock);
    const { mutate: handleBlockToggle, isPending } =
        blockApi.mutation.useBlockToggle();
    const handleClick = () => {
        handleBlockToggle(
            { param: { blockedId } },
            {
                onSuccess: () => {
                    setIsBlocking(!isBlocking);
                    if (redirectTo) {
                        router.replace(redirectTo);
                    }
                },
                onError: () => {
                    setIsBlocking(isBlocking);
                },
            },
        );
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        onClick={handleClick}
                        disabled={isPending}
                        className="group relative flex h-10 w-full items-center justify-center space-x-4 overflow-hidden border border-slate-400 transition-all duration-300 ease-in-out hover:bg-primary-foreground/90"
                    >
                        {isBlocking ? (
                            <CircleSlash2 className="h-5 w-5 text-primary transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:fill-red-400 group-hover:text-primary" />
                        ) : (
                            <LockOpen className="h-5 w-5 text-primary transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:fill-red-400 group-hover:text-primary" />
                        )}
                        {showText && <p>{isBlocking ? "Unblock" : "Block"}</p>}
                    </Button>
                </TooltipTrigger>
                {!showText && (
                    <TooltipContent>
                        <p>{isBlocking ? "Unblock" : "Block"}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
}
