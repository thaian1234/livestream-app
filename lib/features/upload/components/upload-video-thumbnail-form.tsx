"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
    ImagePlusIcon,
    MoreVerticalIcon,
    RotateCcwIcon,
    SparkleIcon,
    Upload,
    X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

import { uploadApi } from "../apis";

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
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: uploadImage, isPending } =
        uploadApi.mutation.useUpload(file);
    console.log(initialImageUrl);
    const handleFile = (selectedFile: File) => {
        if (selectedFile.type.startsWith("image/")) {
            const fileWithPreview = Object.assign(selectedFile, {
                preview: URL.createObjectURL(selectedFile),
            });
            setFile(fileWithPreview);
        }
    };
    useEffect(() => {
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
                            type: "video-thumbnail",
                        },
                        query: {
                            videoId: videoId,
                        },
                    },
                    {
                        onSuccess: () => {
                            queryClient.invalidateQueries({
                                queryKey: ["videos", videoId],
                            });
                        },
                    },
                );
            }
        };
        handleUpload();
    }, [file]);

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    console.log("File input changed");
                    onFileInputChange(e);
                }}
            />
            <FormField
                name="thumbnailUrl"
                control={undefined}
                render={() => (
                    <FormItem>
                        {/* <FormLabel>Thumbnail</FormLabel> */}
                        <FormControl>
                            <div className="group relative h-[100px] w-[253px] border border-dashed border-neutral-400 p-0.5">
                                <Image
                                    src={initialImageUrl || "/circle-play.svg"}
                                    className="object-contain"
                                    fill
                                    alt="Thumbnail"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            type="button"
                                            size="icon"
                                            className="bg-black/50 hover:bg-black/50 absolute right-1 top-1 size-7 rounded-full opacity-100 duration-300 group-hover:opacity-100 md:opacity-0"
                                        >
                                            <MoreVerticalIcon className="text-white" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        side="right"
                                    >
                                        <DropdownMenuItem
                                            onClick={() => {
                                                if (fileInputRef.current) {
                                                    console.log(
                                                        "Opening file selector...",
                                                    );
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
                                        <DropdownMenuItem>
                                            <SparkleIcon className="mr-1 size-4" />
                                            AI-Generated
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </FormControl>
                    </FormItem>
                )}
            ></FormField>
        </>
    );
}
