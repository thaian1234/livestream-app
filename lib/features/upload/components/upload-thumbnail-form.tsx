"use client";

import { uploadApi } from "../apis";
import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";

import DragDropArea from "./drag-drop-area";

interface FileWithPreview extends File {
    preview: string;
}

export function UploadThumbnailForm() {
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const { mutate: uploadImage, isPending } =
        uploadApi.mutation.useUploadThumbnail(file);

    const handleFile = useCallback((selectedFile: File) => {
        if (selectedFile.type.startsWith("image/")) {
            const fileWithPreview = Object.assign(selectedFile, {
                preview: URL.createObjectURL(selectedFile),
            });
            setFile(fileWithPreview);
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
            uploadImage({
                json: {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                },
            });
        }
    };

    return (
        <div className="flex w-full flex-col justify-between rounded-lg bg-background p-6 shadow-md">
            <DragDropArea onFileSelect={handleFile}>
                {file ? (
                    <img src={file.preview} alt={file.name} />
                ) : (
                    <div className="flex aspect-video h-full flex-col items-center justify-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-400">
                            Drag and drop your image here, or click to select a
                            file
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
                                {(file.size / 1024 / 1024).toFixed(2)} MB
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
            <Button
                onClick={handleUpload}
                disabled={isPending || !file}
                className="mt-8 w-full"
                variant={"gradient"}
            >
                Upload Thumbnail
            </Button>
        </div>
    );
}
