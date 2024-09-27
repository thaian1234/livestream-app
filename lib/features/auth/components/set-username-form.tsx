"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPen } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthValidation } from "@/server/api/lib/validations/schema.validation";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import "@/style/auth.css";

export function SetUsernameForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthValidation.Username>({
        resolver: zodResolver(AuthValidation.usernameSchema),
    });
    const onSubmit = handleSubmit((data) => {
        console.log(data);
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
                        //disabled={isPending}
                        tabIndex={1}
                        className="pl-12"
                    />
                </div>
                {errors.username && (
                    <ErrorField>{errors.username.message}</ErrorField>
                )}
            </CardContent>
            <Button className="mt-6 w-full" variant="gradient" type="submit">
                Send
            </Button>
        </form>
    );
}
