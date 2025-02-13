"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { VideoDTO } from "@/server/api/dtos/video.dto";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { videoApi } from "../apis";

interface EditVideoFormProps {
    videoId: string;
    defaultVideo: VideoDTO.Select;
}

export function EditVideoForm({ videoId, defaultVideo }: EditVideoFormProps) {
    const form = useForm<VideoDTO.Update>({
        resolver: zodResolver(VideoDTO.updateSchema),
        defaultValues: defaultVideo,
    });
    const { mutate: handleUpdateVideo, isPending } =
        videoApi.mutation.useUpdateVideo();

    const onSubmit = form.handleSubmit((data) => {
        handleUpdateVideo({
            json: data,
            param: {
                id: videoId,
            },
        });
    });
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="col-span-5 space-y-8 text-2xl">
                <FormField
                    control={form.control}
                    name="title"
                    disabled={isPending}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter you video title"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    disabled={isPending}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Describe yourself"
                                    className="resize-none"
                                    value={field.value || ""}
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    Submit
                </Button>
            </form>
        </Form>
    );
}
