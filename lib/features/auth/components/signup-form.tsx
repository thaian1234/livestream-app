"use client";

import { authApi } from "../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeOff,
    KeyIcon,
    LockIcon,
    MailIcon,
    UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthValidation } from "@/server/api/lib/validations/schema.validation";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPass, setShowconfirmPass] = useState(false);
    const {
        register, // register field name
        handleSubmit, //pass a callback to handle successful
        formState: { errors },
    } = useForm<AuthValidation.Signup>({
        resolver: zodResolver(AuthValidation.signupSchema), //handle errors
    });
    const { mutate: handleSignUp, isPending } = authApi.mutation.useSignUp();
    const onSubmit = handleSubmit((data) => {
        handleSignUp({
            json: data,
        });
    });
    return (
        <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
                <div className="relative flex">
                    <UserIcon className="absolute left-3 top-1/2 z-50 size-5 -translate-y-1/2 transform text-gray-500" />
                    <Input
                        {...register("username")}
                        placeholder="Username"
                        disabled={isPending}
                        variant={errors.username ? "error" : "primary"}
                        tabIndex={1}
                        className="pl-12"
                    />
                </div>
                {errors.username && (
                    <ErrorField>{errors.username.message}</ErrorField>
                )}
                <div className="relative flex">
                    <MailIcon className="absolute left-3 top-1/2 z-50 size-5 -translate-y-1/2 transform text-gray-500 hover:text-gray-500" />
                    <Input
                        {...register("email")}
                        placeholder="Email"
                        disabled={isPending}
                        variant={errors.email ? "error" : "primary"}
                        tabIndex={2}
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
                        placeholder="Password"
                        disabled={isPending}
                        variant={errors.password ? "error" : "primary"}
                        tabIndex={3}
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
                <div className="relative flex">
                    <KeyIcon className="absolute left-3 top-1/2 z-50 size-5 -translate-y-1/2 transform text-gray-500" />
                    <Input
                        {...register("confirmPassword")}
                        type={showconfirmPass ? "text" : "password"}
                        placeholder="Confirm Password"
                        disabled={isPending}
                        variant={errors.confirmPassword ? "error" : "primary"}
                        tabIndex={4}
                        className="pl-12"
                    />
                    <button
                        className="absolute right-5 top-1/4 size-3 text-white"
                        type="button"
                        onClick={() => {
                            setShowconfirmPass(!showconfirmPass);
                        }}
                        disabled={isPending}
                    >
                        {showconfirmPass ? (
                            <EyeOff size={22} />
                        ) : (
                            <Eye size={22} />
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <ErrorField>{errors.confirmPassword.message}</ErrorField>
                )}
            </CardContent>
            <CardFooter className="mt-8">
                <Button
                    className="w-full"
                    type="submit"
                    variant="gradient"
                    disabled={isPending}
                    tabIndex={5}
                >
                    Sign Up
                </Button>
            </CardFooter>
        </form>
    );
}
