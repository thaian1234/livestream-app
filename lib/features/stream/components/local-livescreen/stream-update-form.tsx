import { useCompletion } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveAllIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { RiAiGenerate2 } from "react-icons/ri";
import { toast } from "sonner";

import { StreamDTO } from "@/server/api/dtos/stream.dto";

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

import { streamApi } from "../../apis";

interface StreamUpdateFormProps {
    initialValues: StreamDTO.Select;
    username: string;
}

export function StreamUpdateForm({
    initialValues,
    username,
}: StreamUpdateFormProps) {
    const form = useForm<StreamDTO.Update>({
        resolver: zodResolver(StreamDTO.updateSchema),
        defaultValues: {
            name: initialValues.name,
        },
    });
    const streamMutation = streamApi.mutation.useUpdateStream(username);
    const generatedTitle = useCompletion({
        api: "/api/streams/generate-title",
        onFinish(prompt, completion) {
            form.setValue("name", completion, {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
    });

    const onSubmit = form.handleSubmit((data) => {
        if (data.name === initialValues.name) return;
        streamMutation.mutate(
            {
                json: {
                    name: data.name,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Stream updated successfully");
                },
                onError: () => {
                    toast.error("Failed to update stream");
                },
            },
        );
    });

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className="flex w-full items-start justify-between space-x-4 space-y-12"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="flex items-center gap-2">
                                <h2>Title</h2>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        generatedTitle.complete("title")
                                    }
                                    loading={generatedTitle.isLoading}
                                    size="icon"
                                >
                                    {!generatedTitle.isLoading && (
                                        <RiAiGenerate2 className="size-6" />
                                    )}
                                </Button>
                            </FormLabel>
                            <FormControl>
                                {!generatedTitle.isLoading ? (
                                    <Input
                                        placeholder="Today stream"
                                        type="text"
                                        className="w-full"
                                        {...field}
                                    />
                                ) : (
                                    <Input
                                        className="w-full"
                                        value={generatedTitle.completion}
                                        disabled
                                    />
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    loading={streamMutation.isPending}
                    className="hover:bg-transparent"
                >
                    {!streamMutation.isPending && <SaveAllIcon />}
                </Button>
            </form>
        </Form>
    );
}
