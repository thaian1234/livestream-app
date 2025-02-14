"use client";

import { CallRecording } from "@stream-io/node-sdk";
import { PlusIcon } from "lucide-react";
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

import { videoApi } from "../apis";
import { RecordingsPicker } from "./recordings-picker";

export function CreateVideoDialog() {
    const [selectedRecording, setSelectedRecording] =
        useState<CallRecording | null>(null);
    const { mutate } = videoApi.mutation.useCreateVideo();

    const handleCreateVideo = () => {
        if (selectedRecording) {
            console.log(
                "Creating video with selected recording URL:",
                selectedRecording,
            );
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <PlusIcon />
                    Create
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl lg:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Create Video Content</DialogTitle>
                </DialogHeader>
                <div className="grid">
                    <RecordingsPicker
                        onSelect={setSelectedRecording}
                        selectedRecording={selectedRecording}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
