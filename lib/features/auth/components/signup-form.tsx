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

import { AuthDTO } from "@/server/api/dtos/auth.dto";

import { ErrorField } from "@/components/error-field";
import { IconInput, LeftIcon, RightIcon } from "@/components/icon-input";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPass, setShowconfirmPass] = useState(false);
    const {
        register, // register field name
        handleSubmit, //pass a callback to handle successful
        formState: { errors },
    } = useForm<AuthDTO.Signup>({
        resolver: zodResolver(AuthDTO.signupSchema), //handle errors
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
                <IconInput
                    {...register("username")}
                    placeholder="Username"
                    disabled={isPending}
                    variant={errors.username ? "error" : "primary"}
                    tabIndex={1}
                    className="pl-12"
                >
                    <LeftIcon>
                        <UserIcon className="size-5 text-gray-500" />
                    </LeftIcon>
                </IconInput>
                {errors.username && (
                    <ErrorField>{errors.username.message}</ErrorField>
                )}
                <IconInput
                    {...register("email")}
                    placeholder="Email"
                    disabled={isPending}
                    variant={errors.email ? "error" : "primary"}
                    tabIndex={2}
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
                    placeholder="Password"
                    disabled={isPending}
                    variant={errors.password ? "error" : "primary"}
                    tabIndex={3}
                    className="px-12"
                >
                    <LeftIcon>
                        <LockIcon className="size-5 text-gray-500" />
                    </LeftIcon>
                    <RightIcon>
                        <button
                            className="text-white"
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
                <IconInput
                    {...register("confirmPassword")}
                    type={showconfirmPass ? "text" : "password"}
                    placeholder="Confirm Password"
                    disabled={isPending}
                    variant={errors.confirmPassword ? "error" : "primary"}
                    tabIndex={4}
                    className="px-12"
                >
                    <LeftIcon>
                        <KeyIcon className="size-5 text-gray-500" />
                    </LeftIcon>
                    <RightIcon>
                        <button
                            className="text-white"
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
                    </RightIcon>
                </IconInput>
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
