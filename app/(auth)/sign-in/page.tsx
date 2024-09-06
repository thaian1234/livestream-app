'use client'

import { clientAPI } from "@/lib/features";

import { LoginButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardBody } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { IconLogin } from "@/components/auth/icon-login";
import "@/style/auth.css"
import { useForm } from "react-hook-form";
import { ErrorField } from "@/components/error-field";
import { useState } from "react";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

 const loginSchema = z.object({
    email: z.string()
    .min(1, { message: "Email is required" })
    .email("Invalid email"), 
    password: z.string()
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
        getValues   //get values from
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
                    <CardTitle className="font-normal text-base">Glad you’re back.!</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <CardContent>
                        <Input
                            type="email" {...register("email")}
                            id="email"
                            placeholder="Enter your email"
                            variant={errors.email ? "error" : "primary"}
                        />
                        {errors.email && <ErrorField>{errors.email.message}</ErrorField>}

                        <Input
                            type="password"
                            {...register("password")}
                            id="password"
                            placeholder="Enter your password"
                            variant={errors.password ? "error" : "primary"}
                        >
                        </Input>
                        {errors.password && <ErrorField>{errors.password.message}</ErrorField>}
                        <div className="flex items-center space-x-1">
                            <Checkbox id="terms" />
                            <CardTitle className="font-normal text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Remember me
                            </CardTitle>
                        </div>
                    </CardContent >
                    <CardContent className="items-center">
                        <Button className="w-full" type="submit" variant="gradient">
                            Login</Button>
                        <CardTitle className="font-normal text-base ">
                            <a className="hover:underline"> Forgot password ?</a>
                        </CardTitle>
                    </CardContent>
                </form>
                <IconLogin></IconLogin>
            </CardBody>
            <CardFooter className="items-center">
                <CardTitle className="font-normal text-base">Don't have an account?
                    <a href="/sign-up" className="hover:underline "> Signup</a>
                </CardTitle>
            </CardFooter>
        </Card>
    )
}   