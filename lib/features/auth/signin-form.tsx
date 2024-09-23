"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthValidation } from "@/server/api/lib/validations/schema.validation";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues, //get values from
    } = useForm<AuthValidation.Signin>({
        resolver: zodResolver(AuthValidation.signinSchema),
    });
    const values = getValues();
    // Hàm xử lý khi submit form
    const submitHandler = (data: AuthValidation.Signin) => {
        console.log(data.email + " " + data.password);
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)}>
            <CardContent>
                <Input
                    {...register("email")}
                    placeholder="Enter your email"
                    variant={errors.email ? "error" : "primary"}
                />
                {errors.email && (
                    <ErrorField>{errors.email.message}</ErrorField>
                )}
                <div className="relative flex">
                    <Input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Enter your password"
                        variant={errors.password ? "error" : "primary"}
                    />
                    <button
                        className="absolute right-5 top-1/4 h-3 w-3 text-white"
                        type="button"
                        onClick={() => {
                            setShowPassword(!showPassword);
                        }}
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
                <Button className="w-full" type="submit" variant="gradient">
                    Login
                </Button>
                <CardTitle className="text-base font-normal">
                    <a className="hover:underline"> Forgot password ?</a>
                </CardTitle>
            </CardContent>
        </form>
    );
}
