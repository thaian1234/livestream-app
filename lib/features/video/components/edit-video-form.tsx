"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { SiPrivateinternetaccess } from "react-icons/si";

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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { UploadVideoThumbnailForm } from "../../upload/components/upload-video-thumbnail-form";
import { videoApi } from "../apis";
import { DeleteVideoButton } from "./delete-video-btn";
import { VideoPreviewSection } from "./video-preview-section";

interface EditVideoFormProps {
    videoId: string;
    defaultVideo: VideoDTO.Select;
}

const VISIBILITY_OPTIONS = [
    { value: "private", icon: SiPrivateinternetaccess, label: "Private" },
    { value: "public", icon: AiOutlineGlobal, label: "Public" },
    { value: "followers_only", icon: FaUsers, label: "Followers Only" },
] as const;

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
                <Card className="mx-auto">
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
                                disabled={!form.formState.isDirty}
                                className="flex items-center gap-2"
                            >
                                {!isPending && <SaveIcon />}
                                Save
                            </Button>
                            <DeleteVideoButton videoId={videoId} />
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="grid grid-cols-8 gap-x-8">
                        {/* Information Section */}
                        <section className="col-span-5">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your video title"
                                                disabled={isPending}
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Enter your video description"
                                                value={field.value || ""}
                                                className="h-56 resize-none"
                                                maxLength={1000}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a visibility to display" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {VISIBILITY_OPTIONS.map(
                                                    ({
                                                        value,
                                                        label,
                                                        icon: Icon,
                                                    }) => (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="h-4 w-4" />
                                                                {label}
                                                            </div>
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </section>
                        {/* Preview Section */}
                        <section className="col-span-3">
                            <VideoPreviewSection video={defaultVideo} />
                        </section>
                        <section className="col-span-3 space-y-2">
                            <Label className="text-sm font-medium">
                                Upload Video Thumbnail
                            </Label>
                            <UploadVideoThumbnailForm
                                videoId={videoId}
                                initialImageUrl={defaultVideo.thumbnailUrl}
                            />
                        </section>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
