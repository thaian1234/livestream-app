"use client";

import { userApi } from "../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useUser } from "@/lib/hooks/use-user";

import { UserValidation } from "@/server/api/lib/validations/schema.validation";

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
import { Switch } from "@/components/ui/switch";

export function ChangePasswordForm() {
    const { mutate: handleChangePassword, isPending } =
        userApi.mutation.useChangePassword();
    const { user } = useUser();
    const form = useForm<UserValidation.UpdatePassword>({
        resolver: zodResolver(UserValidation.updatePasswordSchema),
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
                param: {
                    id: user.id,
                },
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
        <Card className="rounded-lg border-2">
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
                        onCheckedChange={setChangePassword}
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
                                        <Input
                                            disabled={
                                                !changePassword || isPending
                                            }
                                            type="password"
                                            {...field}
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
                                        <Input
                                            disabled={
                                                !changePassword || isPending
                                            }
                                            type="password"
                                            {...field}
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
                                        <Input
                                            disabled={
                                                !changePassword || isPending
                                            }
                                            type="password"
                                            {...field}
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