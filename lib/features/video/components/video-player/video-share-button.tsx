"use client";

import { Check, Copy, Share2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShareButtonProps extends ButtonProps {
    showText?: boolean;
}

export default function VideoShareButton({
    variant = "outline",
    size = "default",
    showText = true,
    className,
    ...props
}: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        // Get the current URL when component mounts
        if (typeof window !== "undefined") {
            setUrl(window.location.href);
        }
    }, []);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy URL: ", err);
        }
    };

    return (
        <TooltipProvider>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={variant}
                        size={size}
                        className={className}
                        {...props}
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        {showText && "Share"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="space-y-4">
                        <h4 className="font-medium leading-none">Share</h4>
                        <div className="flex space-x-2">
                            <Input value={url} readOnly className="flex-1" />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            onClick={copyToClipboard}
                                            variant="outline"
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">
                                                {copied ? "Copied" : "Copy URL"}
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{copied ? "Copied!" : "Copy URL"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    );
}
