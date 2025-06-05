"use client";

import "@/style/auth.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPen } from "lucide-react";
import { useForm } from "react-hook-form";

import { useUser } from "@/lib/hooks/use-user";

import { AuthDTO } from "@/server/api/dtos/auth.dto";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ErrorField } from "@/components/error-field";

import { userApi } from "../../user/apis";
import { authApi } from "../apis";

export function SetUsernameForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthDTO.Username>({
        resolver: zodResolver(AuthDTO.usernameSchema),
    });
    const { mutate: handleUpdateUsername, isPending } =
        authApi.mutation.useSetUsername();
    const onSubmit = handleSubmit((data) => {
        handleUpdateUsername({
            json: {
                username: data.username,
            },
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <CardContent>
                <div className="relative flex">
                    <UserRoundPen className="absolute left-3 top-1/2 z-50 size-5 -translate-y-1/2 transform text-gray-500 hover:text-gray-500" />
                    <Input
                        {...register("username")}
                        placeholder="Enter your username"
                        variant={errors.username ? "error" : "primary"}
                        disabled={isPending}
                        tabIndex={1}
                        className="pl-12"
                    />
                </div>
                {errors.username && (
                    <ErrorField>{errors.username.message}</ErrorField>
                )}
            </CardContent>
            <Button
                className="mt-6 w-full"
                variant="gradient"
                type="submit"
                disabled={isPending}
            >
                Submit
            </Button>
        </form>
    );
}
