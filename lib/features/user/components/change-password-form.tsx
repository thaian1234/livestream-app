"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useUser } from "@/lib/hooks/use-user";

import { UserDTO } from "@/server/api/dtos/user.dto";

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
import { Label } from "@/components/ui/label";
import { SecretInput } from "@/components/ui/secret-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

import { userApi } from "../apis";

export function ChangePasswordForm() {
    const { mutate: handleChangePassword, isPending } =
        userApi.mutation.useChangePassword();
    const form = useForm<UserDTO.UpdatePassword>({
        resolver: zodResolver(UserDTO.updatePasswordSchema),
        defaultValues: {
            confirmPassword: "",
            currentPassword: "",
            newPassword: "",
        },
    });
    const [changePassword, setChangePassword] = useState(false);
    const handleSubmit = form.handleSubmit((data) => {
        handleChangePassword(
            {
                json: data,
            },
            {
                onSuccess() {
                    form.reset();
                    setChangePassword(false);
                },
            },
        );
    });

    return (
        <Card className="rounded-lg border-4 border-slate-700">
            <div className="flex items-start justify-between">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="change-password" className="underline">
                        I want to change my password
                    </Label>
                    <Switch
                        id="change-password"
                        checked={changePassword}
                        onCheckedChange={() => {
                            setChangePassword((prev) => !prev);
                            form.reset();
                        }}
                    />
                </div>
            </div>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <SecretInput
                                            {...field}
                                            disabled={
                                                !changePassword || isPending
                                            }
                                            leftIcon={
                                                <LockIcon className="size-5" />
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <SecretInput
                                            {...field}
                                            disabled={
                                                !changePassword || isPending
                                            }
                                            leftIcon={
                                                <LockIcon className="size-5" />
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <SecretInput
                                            {...field}
                                            disabled={
                                                !changePassword || isPending
                                            }
                                            leftIcon={
                                                <LockIcon className="size-5" />
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!changePassword || isPending}
                            type="submit"
                        >
                            Confirm Password Change
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export function ChangePasswordFormSkeleton() {
    return (
        <Card className="rounded-lg border-4 border-slate-700">
            <div className="flex items-start justify-between">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="change-password" className="underline">
                        I want to change my password
                    </Label>
                    <Switch disabled />
                </div>
            </div>
            <CardContent>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
