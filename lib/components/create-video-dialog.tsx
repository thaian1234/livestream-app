"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "sonner";

import { StorageDTO } from "@/server/api/dtos/storage.dto";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { RecordingsPicker } from "../features/storage/components/recording-picker";
import { videoApi } from "../features/video/apis";

export function CreateVideoDialog() {
    const [selectedRecording, setSelectedRecording] =
        useState<StorageDTO.Select | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { mutate, isPending } = videoApi.mutation.useCreateVideo();

    const handleCreateVideo = () => {
        if (selectedRecording) {
            mutate(
                {
                    json: {
                        title: "Untitled",
                        videoUrl: selectedRecording.fileUrl || "",
                        duration:
                            new Date(selectedRecording.endTime).getTime() -
                            new Date(selectedRecording.startTime).getTime(),
                        status: "ready",
                        storageId: selectedRecording.id,
                    },
                },
                {
                    onSettled: () => {
                        setSelectedRecording(null);
                        setIsOpen(false);
                    },
                },
            );
        } else {
            toast.error("Please select a recording first");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Upload className="mr-2 size-4" />
                    Upload
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl lg:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Create Video Content</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-12 gap-x-10">
                    <div className="col-span-5">
                        <RecordingsPicker
                            onSelect={setSelectedRecording}
                            selectedRecording={selectedRecording}
                        />
                    </div>
                    <div className="col-span-7">
                        {!!selectedRecording && (
                            <div className="relative aspect-video overflow-hidden rounded-md">
                                <ReactPlayer
                                    url={selectedRecording.fileUrl || ""}
                                    width="100%"
                                    height="100%"
                                    playing={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleCreateVideo}
                        disabled={!selectedRecording}
                        loading={isPending}
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
