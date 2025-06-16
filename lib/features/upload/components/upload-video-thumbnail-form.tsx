"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ImagePlusIcon, MoreVerticalIcon, SparkleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { VideoThumbnail } from "@/components/thumbnail";

import { uploadApi } from "../apis";
import { ThumbnailGenerateDialog } from "./thumbnail-generate-dialog";

interface FileWithPreview extends File {
    preview: string;
}
interface UploadVideoThumbnailFormProps {
    initialImageUrl: string | null;
    videoId: string;
}

export function UploadVideoThumbnailForm({
    initialImageUrl,
    videoId,
}: UploadVideoThumbnailFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<FileWithPreview | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        initialImageUrl,
    );
    const [open, setOpen] = useState(false);

    const { mutate: uploadImage, isPending } =
        uploadApi.mutation.useUpload(file);

    useEffect(() => {
        const handleUpload = () => {
            if (file) {
                uploadImage({
                    json: {
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                    },
                    param: {
                        type: "video-thumbnail",
                    },
                    query: {
                        videoId: videoId,
                    },
                });
            }
        };
        handleUpload();
    }, [file, uploadImage, videoId]);

    useEffect(() => {
        if (initialImageUrl) {
            setPreviewUrl(initialImageUrl);
        }
    }, [initialImageUrl]);

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile: File) => {
        if (selectedFile.type.startsWith("image/")) {
            const fileWithPreview = Object.assign(selectedFile, {
                preview: URL.createObjectURL(selectedFile),
            });
            setFile(fileWithPreview);
            setPreviewUrl(fileWithPreview.preview);
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={onFileInputChange}
                disabled={isPending}
            />
            <div className="group relative aspect-video max-w-sm rounded-lg border border-dashed border-neutral-400">
                <VideoThumbnail thumbnailUrl={previewUrl} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            size="icon"
                            className="bg-black/50 hover:bg-black/50 absolute -right-8 -top-1 size-8 rounded-full opacity-100 duration-300 group-hover:opacity-100 md:opacity-0"
                            disabled={isPending}
                        >
                            <MoreVerticalIcon className="text-white" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="right">
                        <DropdownMenuItem
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                } else {
                                    console.error("fileInputRef is null");
                                }
                            }}
                        >
                            <ImagePlusIcon className="mr-1 size-4" />
                            Change
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            <SparkleIcon className="mr-1 size-4" />
                            AI-Generated
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <ThumbnailGenerateDialog
                videoId={videoId}
                open={open}
                setOpen={setOpen}
            />
        </>
    );
}
