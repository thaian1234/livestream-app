"use client";

import "@/style/auth.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthDTO } from "@/server/api/dtos/auth.dto";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";

import { ErrorField } from "@/components/error-field";
import { IconInput, LeftIcon, RightIcon } from "@/components/icon-input";

import { authApi } from "../apis";

export function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthDTO.Signin>({
        resolver: zodResolver(AuthDTO.signinSchema),
    });
    const { mutate: handleSignIn, isPending } = authApi.mutation.useSignIn();
    const onSubmit = handleSubmit((data) => {
        handleSignIn({
            json: data,
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <CardContent className="flex flex-col space-y-4">
                <IconInput
                    {...register("email")}
                    placeholder="Enter your email"
                    variant={errors.email ? "error" : "primary"}
                    disabled={isPending}
                    tabIndex={1}
                    className="pl-12"
                >
                    <LeftIcon>
                        <MailIcon className="size-5 text-gray-500" />
                    </LeftIcon>
                </IconInput>
                {errors.email && (
                    <ErrorField>{errors.email.message}</ErrorField>
                )}
                <PasswordInput
                    {...register("password")}
                    showStrengthIndicator
                    placeholder="Enter your password"
                    tabIndex={2}
                />
            </CardContent>
            <CardFooter className="mt-8 flex flex-col items-center space-y-4">
                <Button
                    className="w-full"
                    type="submit"
                    variant="gradient"
                    disabled={isPending}
                    tabIndex={3}
                >
                    Login
                </Button>
                <CardTitle className="text-base font-normal hover:underline">
                    <Link href={"/forget-password"}>Forgot password ?</Link>
                </CardTitle>
            </CardFooter>
        </form>
    );
}
