"use client";

import { authApi } from "../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthDTO } from "@/server/api/dtos/auth.dto";

import { ErrorField } from "@/components/error-field";
import { IconInput, LeftIcon, RightIcon } from "@/components/icon-input";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardTitle } from "@/components/ui/card";

import "@/style/auth.css";

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
                <IconInput
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    variant={errors.password ? "error" : "primary"}
                    disabled={isPending}
                    tabIndex={1}
                    className="px-12"
                >
                    <LeftIcon>
                        <LockIcon className="size-5 text-gray-500" />
                    </LeftIcon>
                    <RightIcon>
                        <button
                            className="size-5 text-white"
                            type="button"
                            onClick={() => {
                                setShowPassword(!showPassword);
                            }}
                            disabled={isPending}
                        >
                            {showPassword ? (
                                <EyeOff size={22} />
                            ) : (
                                <Eye size={22} />
                            )}
                        </button>
                    </RightIcon>
                </IconInput>
                {errors.password && (
                    <ErrorField>{errors.password.message}</ErrorField>
                )}
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
