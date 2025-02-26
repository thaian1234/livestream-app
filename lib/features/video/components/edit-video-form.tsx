"use client";

import { useCompletion } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { MdSettingsBackupRestore } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
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
import { VideoCategoriesForm } from "./video-categories-form";

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
        defaultValues: {
            title: defaultVideo.title,
            description: defaultVideo.description,
            visibility: defaultVideo.visibility,
        },
    });
    const [canRollback, setCanRollback] = useState({
        title: false,
        description: false,
    });
    const { mutate: handleUpdateVideo, isPending } =
        videoApi.mutation.useUpdateVideo();
    const {
        complete: completeTitle,
        completion: completionTitle,
        isLoading: isGeneratingTitle,
    } = useCompletion({
        api: "/api/videos/generate-title",
        onFinish(prompt, completion) {
            form.setValue("title", completion, {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
    });
    const {
        complete: completeDescription,
        completion: completionDescription,
        isLoading: isGeneratingDescription,
    } = useCompletion({
        api: "/api/videos/generate-description",
        onFinish(prompt, completion) {
            form.setValue("description", completion, {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
    });
    const isLoading = isPending || isGeneratingTitle || isGeneratingDescription;
    const onSubmit = form.handleSubmit((data) => {
        handleUpdateVideo({
            json: data,
            param: {
                id: videoId,
            },
        });
    });
    const handleGenerate = (type: "title" | "description") => {
        const body = {
            imageUrl: defaultVideo.thumbnailUrl,
        };

        if (type === "title") {
            completeTitle("Title", {
                body,
            });
            setCanRollback({
                ...canRollback,
                title: true,
            });
        } else {
            completeDescription("Description", {
                body,
            });
            setCanRollback({
                ...canRollback,
                description: true,
            });
        }
    };

    const handleRollback = (type: "title" | "description") => {
        if (!canRollback) return;
        if (type === "title") {
            form.setValue("title", defaultVideo.title, {
                shouldDirty: true,
                shouldValidate: true,
            });
        } else {
            form.setValue("description", defaultVideo.description, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="col-span-5 text-2xl">
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
                                disabled={isLoading}
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
                                        <FormLabel className="flex items-center gap-2">
                                            <h2>Title</h2>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleGenerate("title")
                                                }
                                                loading={isGeneratingTitle}
                                                size="icon"
                                            >
                                                {!isGeneratingTitle && (
                                                    <RiAiGenerate2 className="size-6" />
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleRollback("title")
                                                }
                                                disabled={
                                                    isLoading ||
                                                    !canRollback.title
                                                }
                                                size="icon"
                                            >
                                                <MdSettingsBackupRestore className="size-6" />
                                            </Button>
                                        </FormLabel>
                                        <FormControl>
                                            {!isGeneratingTitle ? (
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your video title"
                                                    disabled={isLoading}
                                                />
                                            ) : (
                                                <Input
                                                    value={completionTitle}
                                                    disabled={isLoading}
                                                />
                                            )}
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
                                        <FormLabel className="flex items-center gap-1">
                                            <h2>Description</h2>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleGenerate(
                                                        "description",
                                                    )
                                                }
                                                loading={
                                                    isGeneratingDescription
                                                }
                                                size="icon"
                                            >
                                                {!isGeneratingDescription && (
                                                    <RiAiGenerate2 className="size-6" />
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleRollback(
                                                        "description",
                                                    )
                                                }
                                                disabled={
                                                    isLoading ||
                                                    !canRollback.description
                                                }
                                                size="icon"
                                            >
                                                <MdSettingsBackupRestore className="size-6" />
                                            </Button>
                                        </FormLabel>
                                        <FormControl>
                                            {!isGeneratingDescription ? (
                                                <Textarea
                                                    {...field}
                                                    placeholder="Enter your video description"
                                                    value={field.value || ""}
                                                    className="h-56 resize-none"
                                                    maxLength={1000}
                                                    disabled={isPending}
                                                />
                                            ) : (
                                                <Textarea
                                                    value={
                                                        completionDescription
                                                    }
                                                    className="h-56 resize-none"
                                                    maxLength={1000}
                                                    disabled={isLoading}
                                                />
                                            )}
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
                            <VideoCategoriesForm videoId={videoId} />
                        </section>
                        {/* Preview Section */}
                        <section className="col-span-3">
                            <VideoPreviewSection video={defaultVideo} />
                        </section>
                        {/* Upload Thumbnail Section */}
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
