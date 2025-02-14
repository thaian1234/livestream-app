"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { VideoDTO } from "@/server/api/dtos/video.dto";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { videoApi } from "../apis";
import { DeleteVideoButton } from "./delete-video-btn";

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
                <Card className="mx-auto max-w-screen-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-2">
                            <CardTitle>Video details</CardTitle>
                            <CardDescription>
                                Manage your video details
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                loading={isPending}
                                className="flex items-center gap-2"
                            >
                                {!isPending && <SaveIcon />}
                                Save
                            </Button>
                            <DeleteVideoButton videoId={videoId} />
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="title"
                            disabled={isPending}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your video title"
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter your video description"
                                            className="resize-none"
                                            value={field.value || ""}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
