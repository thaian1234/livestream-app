'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardBody } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { IconLogin } from "@/components/auth/icon-login";
import "@/style/auth.css"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorField } from "@/components/error-field";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signupSchema = z.object({
    username: z.string()
        .min(1, { message: "Username is required" }),
    email: z.string()
        .email("Invalid email")
        .min(1, { message: "Email is required" }),
    password: z.string()
        .min(1, { message: "Passwork is required" })
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
        .min(1, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
});
type LoginFormValues = z.infer<typeof signupSchema>; // Infer type from schema of Zod


export default function Page() {
    const { 
        register, // register field name
        handleSubmit, //pass a callback to handle successful
        formState: { errors },
        getValues   //get values from
    } = useForm<LoginFormValues>({
        resolver: zodResolver(signupSchema), //handle errors
    });
    const submitHandler = (data: LoginFormValues) => {
        // thêm đoạn code gửi email đăng ký
        console.log(data.username + " " + data.email + " " + data.password + " " + data.confirmPassword);
    }
    return (
        <Card className="justify-between text-base">
            <CardBody>
                <CardHeader>
                    <CardTitle>Signup</CardTitle>
                    <CardTitle className="font-normal text-base">Just some details to get you in.!</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <CardContent>
                        <Input
                            id="username"
                            placeholder="Username"
                            variant={errors.username ? "error" : "primary"}
                            {...register("username")}
                        />
                        {errors.username && <ErrorField>{errors.username.message}</ErrorField>}
                        <Input
                            type="email"
                            id="email"
                            placeholder="Email"
                            variant={errors.email ? "error" : "primary"}
                            {...register("email")}
                        />
                        {errors.email && <ErrorField>{errors.email.message}</ErrorField>}
                        <Input
                            type="password"
                            id="password"
                            placeholder="Password"
                            variant={errors.password ? "error" : "primary"}
                            {...register("password")}
                        />
                        {errors.password && <ErrorField>{errors.password.message}</ErrorField>}

                        <Input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            variant={errors.confirmPassword ? "error" : "primary"}
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && <ErrorField>{errors.confirmPassword.message}</ErrorField>}

                    </CardContent>
                    <CardContent>
                        <Button className="w-full" type="submit" variant="gradient" >
                            Signup</Button>
                    </CardContent>
                </form>
                <IconLogin></IconLogin>
            </CardBody>
            <CardFooter className="items-center">
                <CardTitle className="font-normal text-base">Already Registered?
                    <a href="/sign-in" className="hover:underline"> Login</a>
                </CardTitle>
            </CardFooter>
        </Card>

    )
}   