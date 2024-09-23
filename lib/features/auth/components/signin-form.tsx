"use client";

import { authApi } from "../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthValidation } from "@/server/api/lib/validations/schema.validation";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";
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
            <CardContent>
                <Input
                    {...register("email")}
                    placeholder="Enter your email"
                    variant={errors.email ? "error" : "primary"}
                    disabled={isPending}
                />
                {errors.email && (
                    <ErrorField>{errors.email.message}</ErrorField>
                )}
                <div className="relative flex">
                    <Input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        variant={errors.password ? "error" : "primary"}
                        disabled={isPending}
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
            <CardContent className="items-center">
                <Button
                    className="w-full"
                    type="submit"
                    variant="gradient"
                    disabled={isPending}
                >
                    Login
                </Button>
                <CardTitle className="text-base font-normal">
                    <a className="hover:underline"> Forgot password ?</a>
                </CardTitle>
            </CardContent>
        </form>
    );
}
