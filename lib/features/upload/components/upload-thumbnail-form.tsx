"use client";

import { ImagePlusIcon, MoreVerticalIcon, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { VideoThumbnail } from "@/components/thumbnail";

import { uploadApi } from "../apis";
import DragDropArea from "./drag-drop-area";

interface FileWithPreview extends File {
    preview: string;
}
interface UploadThumbnailFormProps {
    initialImageUrl: string | null;
}

export function UploadThumbnailForm({
    initialImageUrl,
}: UploadThumbnailFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<FileWithPreview | null>(null);

    const { mutate: uploadImage, isPending } =
        uploadApi.mutation.useUpload(file);

    const handleFile = useCallback((selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) return;

        setFile((prev) => {
            if (prev) URL.revokeObjectURL(prev.preview);
            return Object.assign(selectedFile, {
                preview: URL.createObjectURL(selectedFile),
            });
        });
    }, []);

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

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
                    },
                    param: {
                        type: "stream-thumbnail",
                    },
                    query: {
                        videoId: undefined,
                    },
                },
                {
                    onSuccess: () => {
                        removeFile();
                    },
                },
            );
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
            <div className="flex flex-col justify-between rounded-lg py-6 shadow-md">
                <div className="group relative">
                    <DragDropArea onFileSelect={handleFile}>
                        {file ? (
                            <div className="relative aspect-video h-full w-full">
                                <VideoThumbnail
                                    thumbnailUrl={file.preview}
                                    alt={file.name}
                                />
                            </div>
                        ) : (
                            <div className="flex aspect-video h-full flex-col items-center justify-center">
                                {!!initialImageUrl ? (
                                    <div className="relative aspect-video h-full w-full">
                                        <VideoThumbnail
                                            thumbnailUrl={initialImageUrl}
                                            alt="Thumbnail Image"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-400">
                                            Drag and drop your image here, or
                                            click to select a file
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </DragDropArea>

                    {/* Dropdown Menu - chỉ hiện khi có image */}
                    {(file || initialImageUrl) && (
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
                                            console.error(
                                                "fileInputRef is null",
                                            );
                                        }
                                    }}
                                >
                                    <ImagePlusIcon className="mr-1 size-4" />
                                    Change
                                </DropdownMenuItem>
                                {file && (
                                    <DropdownMenuItem onClick={removeFile}>
                                        <X className="mr-1 size-4" />
                                        Remove
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* File info - chỉ hiện khi có file được chọn */}
                {file && (
                    <>
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
                                    disabled={isPending}
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <Button
                            onClick={handleUpload}
                            disabled={isPending || !file}
                            className="mt-8 w-full"
                            variant={"gradient"}
                        >
                            Upload Thumbnail
                        </Button>
                    </>
                )}
            </div>
        </>
    );
}
