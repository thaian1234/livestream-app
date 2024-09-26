"use client";

import { userApi } from "../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUser } from "@/lib/hooks/use-user";

import { UserValidation } from "@/server/api/lib/validations/schema.validation";

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

export function ProfileUpdateForm() {
    const { user } = useUser();
    const form = useForm<UserValidation.Update>({
        resolver: zodResolver(UserValidation.updateSchema),
        defaultValues: {
            username: user.username,
            bio: user.bio,
        },
    });
    const { mutate: handleUpdateProfile, isPending } =
        userApi.mutation.useUpdateProfile();

    const onSubmit = form.handleSubmit((data) => {
        handleUpdateProfile({
            param: {
                id: user.id,
            },
            json: {
                bio: data.bio,
                username: data.username,
            },
        });
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="col-span-5 space-y-8 text-2xl">
                <FormField
                    control={form.control}
                    name="username"
                    disabled={isPending}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="jonathan" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
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
