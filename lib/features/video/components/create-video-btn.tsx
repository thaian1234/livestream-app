"use client";

import { PlusCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { videoApi } from "../apis";

export function CreateVideoButton() {
    const { mutate, isPending } = videoApi.mutation.useCreateVideo();

    const handleCreateVideo = () => {
        mutate({
            json: {
                title: "Enter your video title",
                description: "Enter your video description",
            },
        });
    };

    return (
        <Button onClick={handleCreateVideo} loading={isPending}>
            {!isPending && <PlusCircleIcon className="mr-2" />} Create
        </Button>
    );
}
