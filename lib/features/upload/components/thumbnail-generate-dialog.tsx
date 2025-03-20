"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { videoApi } from "../../video/apis";

interface ThumbnailGenerateDialogProps {
    videoId: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function ThumbnailGenerateDialog({
    videoId,
    open,
    setOpen,
}: ThumbnailGenerateDialogProps) {
    const { mutate: generateThumbnail, isPending: isGenerating } =
        videoApi.mutation.useGenerateThumbnail();

    const [inputText, setInputText] = useState("");

    const handleGenerate = () => {
        if (!inputText.length) return;

        generateThumbnail(
            {
                json: {
                    message: inputText,
                    videoId: videoId,
                },
            },
            {
                onSuccess(data, variables, context) {
                    setOpen(false);
                    setInputText("");
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Enter Your Thumbnail Idea</DialogTitle>
                    <DialogDescription>
                        Type your thumbnail idea and click generate.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Textarea
                        maxLength={90}
                        minLength={1}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="col-span-3 mb-6 min-h-[100px]"
                        placeholder="Enter your text here"
                    />
                    <div className="flex justify-between">
                        <div />
                        <Button
                            type="submit"
                            onClick={handleGenerate}
                            disabled={!inputText.length}
                            loading={isGenerating}
                        >
                            Generate
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
