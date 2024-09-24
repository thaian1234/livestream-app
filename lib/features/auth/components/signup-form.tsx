"use client";

import { authApi } from "../apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthValidation } from "@/server/api/lib/validations/schema.validation";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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
            <CardContent>
                <Input
                    {...register("username")}
                    placeholder="Username"
                    disabled={isPending}
                    variant={errors.username ? "error" : "primary"}
                    tabIndex={1}
                />
                {errors.username && (
                    <ErrorField>{errors.username.message}</ErrorField>
                )}
                <Input
                    {...register("email")}
                    placeholder="Email"
                    disabled={isPending}
                    variant={errors.email ? "error" : "primary"}
                    tabIndex={2}
                />
                {errors.email && (
                    <ErrorField>{errors.email.message}</ErrorField>
                )}
                <div className="relative flex">
                    <Input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        disabled={isPending}
                        variant={errors.password ? "error" : "primary"}
                        tabIndex={3}
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
                    <Input
                        {...register("confirmPassword")}
                        type={showconfirmPass ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        disabled={isPending}
                        variant={errors.confirmPassword ? "error" : "primary"}
                        tabIndex={4}
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
            <CardContent>
                <Button
                    className="w-full"
                    type="submit"
                    variant="gradient"
                    disabled={isPending}
                    tabIndex={5}
                >
                    Signup
                </Button>
            </CardContent>
        </form>
    );
}
