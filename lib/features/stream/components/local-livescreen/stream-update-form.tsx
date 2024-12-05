import { streamApi } from "../../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveAllIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { StreamDTO } from "@/server/api/dtos/stream.dto";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
        defaultValues: initialValues,
    });
    const streamMutation = streamApi.mutation.useUpdateStream(username);

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
                className="flex w-full items-start justify-between space-x-4 space-y-7"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Stream Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Today stream"
                                    type="text"
                                    className="w-full"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="hover:bg-transparent"
                >
                    <SaveAllIcon />
                </Button>
            </form>
        </Form>
    );
}
