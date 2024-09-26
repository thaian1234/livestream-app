"use client";

import { uploadApi } from "../apis";
import { Upload, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import DragDropArea from "./drag-drop-area";

interface FileWithPreview extends File {
    preview: string;
}

export function UploadImageForm() {
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: uploadImage, isPending } =
        uploadApi.mutation.useUploadAvatar(file);

    const handleFile = useCallback((selectedFile: File) => {
        if (selectedFile.type.startsWith("image/")) {
            const fileWithPreview = Object.assign(selectedFile, {
                preview: URL.createObjectURL(selectedFile),
            });
            setFile(fileWithPreview);
        }
    }, []);

    const onFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        },
        [handleFile],
    );

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
        <div className="w-full rounded-lg bg-background p-6 shadow-md">
            <DragDropArea onFileSelect={handleFile}>
                {file ? (
                    <img src={file.preview} alt={file.name} />
                ) : (
                    <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                            Drag and drop your image here, or click to select a
                            file
                        </p>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileInputChange}
                    accept="image/*"
                    className="hidden"
                />
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
                Upload Image
            </Button>
        </div>
    );
}
