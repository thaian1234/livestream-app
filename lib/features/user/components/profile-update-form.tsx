"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUser } from "@/lib/hooks/use-user";

import { UserDTO } from "@/server/api/dtos/user.dto";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { userApi } from "../apis";

export function ProfileUpdateForm() {
    const { user } = useUser();
    const form = useForm<UserDTO.Update>({
        resolver: zodResolver(UserDTO.updateSchema),
        defaultValues: {
            username: user.username,
            bio: user.bio,
        },
    });
    const { mutate: handleUpdateProfile, isPending } =
        userApi.mutation.useUpdateProfile();

    const onSubmit = form.handleSubmit((data) => {
        handleUpdateProfile({
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

export function ProfileUpdateFormSkeleton() {
    return (
        <div className="flex flex-col space-y-8">
            {Array.from({
                length: 2,
            }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-24 bg-slate-700" />
                    <Skeleton className="h-10 w-full bg-slate-700" />
                </div>
            ))}
            <Skeleton className="h-10 w-28 bg-slate-700" />
        </div>
    );
}
