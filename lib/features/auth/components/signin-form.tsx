"use client";

import { authApi } from "../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthValidation } from "@/server/api/lib/validations/schema.validation";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import "@/style/auth.css";

export function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthValidation.Signin>({
        resolver: zodResolver(AuthValidation.signinSchema),
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
                <div className="relative flex">
                    <MailIcon className="absolute left-3 top-1/2 z-50 size-5 -translate-y-1/2 transform text-gray-500 hover:text-gray-500" />
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
                <div className="relative flex">
                    <LockIcon className="absolute left-3 top-1/2 z-50 size-5 -translate-y-1/2 transform text-gray-500" />
                    <Input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        variant={errors.password ? "error" : "primary"}
                        disabled={isPending}
                        tabIndex={1}
                        className="pl-12"
                    />
                    <button
                        className="absolute right-5 top-1/4 size-3 text-white"
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
                </div>
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
                <CardTitle className="text-base font-normal">
                    <a className="hover:underline"> Forgot password ?</a>
                </CardTitle>
            </CardFooter>
        </form>
    );
}
