"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { clientAPI } from "@/lib/features";

import { IconLogin } from "@/components/auth/icon-login";
import { ErrorField } from "@/components/error-field";
import { LoginButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardBody,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import "@/style/auth.css";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email("Invalid email"),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
});
type LoginFormValues = z.infer<typeof loginSchema>; // Infer type from schema of Zod
export default function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues, //get values from
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });
    const values = getValues();
    // Hàm xử lý khi submit form
    const submitHandler = (data: LoginFormValues) => {
        console.log(data.email + " " + data.password);
    };
    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardTitle className="text-base font-normal">
                        Glad you’re back.!
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <CardContent>
                        <Input
                            {...register("email")}
                            id="email"
                            placeholder="Enter your email"
                            variant={errors.email ? "error" : "primary"}
                        />
                        {errors.email && (
                            <ErrorField>{errors.email.message}</ErrorField>
                        )}

                        <Input
                            type="password"
                            {...register("password")}
                            id="password"
                            placeholder="Enter your password"
                            variant={errors.password ? "error" : "primary"}
                        ></Input>
                        {errors.password && (
                            <ErrorField>{errors.password.message}</ErrorField>
                        )}
                        <div className="flex items-center space-x-1">
                            <Checkbox id="terms" />
                            <CardTitle className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Remember me
                            </CardTitle>
                        </div>
                    </CardContent>
                    <CardContent className="items-center">
                        <Button
                            className="w-full"
                            type="submit"
                            variant="gradient"
                        >
                            Login
                        </Button>
                        <CardTitle className="text-base font-normal">
                            <a className="hover:underline">
                                {" "}
                                Forgot password ?
                            </a>
                        </CardTitle>
                    </CardContent>
                </form>
                <IconLogin></IconLogin>
            </CardBody>
            <CardFooter className="items-center">
                <CardTitle className="text-base font-normal">
                    Don&apos;t have an account?
                    <a href="/sign-up" className="hover:underline">
                        {" "}
                        Signup
                    </a>
                </CardTitle>
            </CardFooter>
        </Card>
    );
}
