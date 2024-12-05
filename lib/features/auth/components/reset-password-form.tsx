"use client";

import { authApi } from "../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPen } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { AuthDTO } from "@/server/api/dtos/auth.dto";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import "@/style/auth.css";

type ParamsType = {
    token: string;
};

export function ResetPasswordForm() {
    const token = useParams<ParamsType>();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthDTO.ResetPassword>({
        resolver: zodResolver(AuthDTO.resetPasswordSchema),
    });
    const { mutate: handleResetPassword, isPending } =
        authApi.mutation.useResetPassword();
    const onSubmit = handleSubmit((data) => {
        handleResetPassword({
            param: {
                token: token.token,
            },
            json: {
                password: data.password,
                confirmPassword: data.confirmPassword,
            },
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <CardContent>
                <div className="relative flex">
                    <UserRoundPen className="absolute left-3 top-1/2 z-50 size-5 -translate-y-1/2 transform text-gray-500 hover:text-gray-500" />
                    <Input
                        {...register("password")}
                        placeholder="Enter your password"
                        variant={errors.password ? "error" : "primary"}
                        disabled={isPending}
                        tabIndex={1}
                        className="pl-12"
                    />
                </div>
                {errors.password && (
                    <ErrorField>{errors.password.message}</ErrorField>
                )}
            </CardContent>
            <CardContent>
                <div className="relative flex">
                    <UserRoundPen className="absolute left-3 top-1/2 z-50 size-5 -translate-y-1/2 transform text-gray-500 hover:text-gray-500" />
                    <Input
                        {...register("confirmPassword")}
                        placeholder="ReEnter your password"
                        variant={errors.password ? "error" : "primary"}
                        disabled={isPending}
                        tabIndex={1}
                        className="pl-12"
                    />
                </div>
                {errors.confirmPassword && (
                    <ErrorField>{errors.confirmPassword.message}</ErrorField>
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
