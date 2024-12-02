"use client";

import { userApi } from "../../user/apis";
import { authApi } from "../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPen } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthDTO } from "@/server/api/dtos/auth.dto";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import "@/style/auth.css";

export function ForgetPasswordForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthDTO.Email>({
        resolver: zodResolver(AuthDTO.userForgetPassword),
    });
    const { mutate: handleSendForgetPassword, isPending } =
        authApi.mutation.useSendForgetPasswordLink();
    const onSubmit = handleSubmit((data) => {
        handleSendForgetPassword({
            json: {
                email: data.email,
            },
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <CardContent>
                <div className="relative flex">
                    <UserRoundPen className="absolute left-3 top-1/2 z-50 size-5 -translate-y-1/2 transform text-gray-500 hover:text-gray-500" />
                    <Input
                        {...register("email")}
                        placeholder="Enter your email"
                        variant={errors.email ? "error" : "primary"}
                        disabled={isPending}
                        tabIndex={1}
                        className="pl-12"
                    />
                </div>
                {errors.email && (
                    <ErrorField>{errors.email.message}</ErrorField>
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
