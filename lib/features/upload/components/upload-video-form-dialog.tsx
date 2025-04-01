"use client";

import { Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { uploadApi } from "../apis";
import DragDropArea from "./drag-drop-area";
import { useQueryClient } from "@tanstack/react-query";

interface FileWithPreview extends File {
    preview: string;
    duration: number;
}

export function UploadVideoFormDialog() {
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const { mutate: uploadImage, isPending } =
        uploadApi.mutation.useUpload(file);

    const handleFile = useCallback((selectedFile: File) => {
        if (selectedFile.type.startsWith("video/")) {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                const fileWithPreview = Object.assign(selectedFile, {
                    preview: URL.createObjectURL(selectedFile),
                    duration: video.duration,
                });
                console.log("duration", video.duration);
                setFile(fileWithPreview);
            };

            video.onerror = () => {
                console.log("Error loading video");
                setFile(null);
            };

            video.src = URL.createObjectURL(selectedFile);
        }
    }, []);

    const removeFile = () => {
        if (file) {
            URL.revokeObjectURL(file.preview);
            setFile(null);
        }
    };

    const handleUpload = () => {
        if (file) {
            uploadImage(
                {
                    json: {
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                        duration: file.duration,
                    },
                    param: {
                        type: "video-recording",
                    },
                    query: {
                        videoId: undefined,
                    },
                },
                {
                    onSettled() {
                        setIsOpen(false);
                        queryClient.invalidateQueries({ queryKey: ["storages", "recordings"] });
                    },
                },
            );
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
            <DialogContent className="sm:max-w-xl lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create Video Content</DialogTitle>
                </DialogHeader>
                <div className="flex w-full flex-col justify-between rounded-lg bg-background p-6 shadow-md">
                    <DragDropArea onFileSelect={handleFile} fileType=".mp4">
                        {file ? (
                            <div className="relative aspect-video h-full w-full">
                                <video
                                    src={file.preview}
                                    className="h-full w-full rounded-md object-cover"
                                    controls
                                />
                            </div>
                        ) : (
                            <div className="flex aspect-video h-full flex-col items-center justify-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-400">
                                    Drag and drop your video here, or click to
                                    select a file
                                </p>
                            </div>
                        )}
                    </DragDropArea>

                    {file && (
                        <div className="mt-6">
                            <div className="flex items-center space-x-4">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={removeFile}
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleUpload}
                        disabled={isPending || !file}
                        className="mt-8 w-full"
                        variant={"gradient"}
                    >
                        Upload Video
                    </Button>
                    {/* <Button
                            type="submit"
                            onClick={handleCreateVideo}
                            disabled={!selectedRecording}
                            loading={isPending}
                        >
                            Create
                        </Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
