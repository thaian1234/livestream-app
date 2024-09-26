"use client";

import { authApi } from "../../auth/apis";
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
            bio: user.bio,
            username: user.username,
        },
    });

    const onSubmit = form.handleSubmit((data) => {
        console.log(data);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8 text-2xl">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="jonh" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe yourself"
                                    className="resize-none"
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    value={field.value || ""}
                                    name={field.name}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
