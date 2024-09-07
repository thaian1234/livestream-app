"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { IconLogin } from "@/components/auth/icon-login";
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

import "@/style/auth.css";
import { AuthValidation } from "@/server/api/lib/validations/schema.validation";

export default function Page() {
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
