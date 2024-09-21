"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthValidation } from "@/server/api/lib/validations/schema.validation";

import { ErrorField } from "@/components/error-field";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardBody,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { IconLogin } from "@/components/auth/icon-login";
import "@/style/auth.css";

export default function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPass, setShowconfirmPass] = useState(false);

    const {
        register, // register field name
        handleSubmit, //pass a callback to handle successful
        formState: { errors },
        getValues, //get values from
    } = useForm<AuthValidation.Signup>({
        resolver: zodResolver(AuthValidation.signupSchema), //handle errors
    });
    const submitHandler = (data: AuthValidation.Signup) => {
        // thêm đoạn code gửi email đăng ký
        console.log(
            data.username +
                " " +
                data.email +
                " " +
                data.password +
                " " +
                data.confirmPassword,
        );
    };
    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardHeader>
                    <CardTitle>Signup</CardTitle>
                    <CardTitle className="text-base font-normal">
                        Just some details to get you in.!
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <CardContent>
                        <Input
                            placeholder="Username"
                            variant={errors.username ? "error" : "primary"}
                            {...register("username")}
                        />
                        {errors.username && (
                            <ErrorField>{errors.username.message}</ErrorField>
                        )}
                        <Input
                            placeholder="Email"
                            variant={errors.email ? "error" : "primary"}
                            {...register("email")}
                        />
                        {errors.email && (
                            <ErrorField>{errors.email.message}</ErrorField>
                        )}
                        <div className="relative flex">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                variant={errors.password ? "error" : "primary"}
                                {...register("password")}
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
                        <div className="relative flex">
                            <Input
                                type={showconfirmPass ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                variant={
                                    errors.confirmPassword ? "error" : "primary"
                                }
                                {...register("confirmPassword")}
                            />
                            <button
                                className="absolute right-5 top-1/4 h-3 w-3 text-white"
                                type="button"
                                onClick={() => {
                                    setShowconfirmPass(!showconfirmPass);
                                }}
                            >
                                {showconfirmPass ? (
                                    <EyeOff size={22} />
                                ) : (
                                    <Eye size={22} />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <ErrorField>
                                {errors.confirmPassword.message}
                            </ErrorField>
                        )}
                    </CardContent>
                    <CardContent>
                        <Button
                            className="w-full"
                            type="submit"
                            variant="gradient"
                        >
                            Signup
                        </Button>
                    </CardContent>
                </form>
                <IconLogin></IconLogin>
            </CardBody>
            <CardFooter className="items-center">
                <CardTitle className="text-base font-normal">
                    Already Registered?
                    <Link href="/sign-in" className="hover:underline">
                        {" "}
                        Login
                    </Link>
                </CardTitle>
            </CardFooter>
        </Card>
    );
}
