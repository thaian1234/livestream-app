"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { videoApi } from "../apis";

interface DeleteVideoButtonProps {
    videoId: string;
}

export function DeleteVideoButton({ videoId }: DeleteVideoButtonProps) {
    const { mutate, isPending } = videoApi.mutation.useDeleteVideo();

    const handleDeleteVideo = () => {
        mutate({
            param: {
                id: videoId,
            },
        });
    };

    return (
        <Button
            onClick={handleDeleteVideo}
            loading={isPending}
            variant="destructive"
        >
            {!isPending && <Trash2Icon className="mr-2" />} Delete
        </Button>
    );
}
