"use client";

import { SparkleIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ThumbnailGenerateDialogProps {
    handleSubmit: (message: string) => void;
    open: boolean;
    setOpen: (isOpen: boolean) => void;
    onLoad: boolean;
}

export function ThumbnailGenerateDialog({
    handleSubmit,
    open,
    setOpen,
    onLoad
}: ThumbnailGenerateDialogProps) {
    const [inputText, setInputText] = useState("");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enter Your Thumbnail Idea</DialogTitle>
                    <DialogDescription>
                        Type your thumbnail idea and click generate.
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    maxLength={160}
                    minLength={1}
                    id="text-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="col-span-3 mb-6 min-h-[100px]"
                    placeholder="Enter your text here"
                />
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={() => {
                            handleSubmit(inputText);
                        }}
                        loading={onLoad}
                    >
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
