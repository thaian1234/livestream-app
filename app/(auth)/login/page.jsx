'use client'

import { clientAPI } from "@/lib/features";

import { LoginButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardBody } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { IconLogin } from "@/components/auth/iconLogin";
import "@/style/auth.css"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ErrorField } from "@/components/errorField";
import { useState } from "react";

const schema = yup.object().shape({
    email: yup.string()
        .email("Invalid email")
        .required("Email is required"),
    password: yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
});
export default function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues   //get values from
    } = useForm({
        resolver: yupResolver(schema),
    });
    const values = getValues();
    // Hàm xử lý khi submit form
    const submitHandler = (data) => {
        console.log(data.email + " " + data.password);
    };

    return (
        <Card
            style={{ justifyContent: "space-between" }}>
            <CardBody>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardTitle className="font-thin text-sm">Glad you’re back.!</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <CardContent>
                        <Input
                            type="email" {...register("email")}
                            id="email"
                            placeholder="Enter your email"
                            variant={errors.email ? "error" : "primary"}
                            customSize="sm"
                        //error={emailError}
                        />
                        {errors.email && <ErrorField>{errors.email.message}</ErrorField>}
                        <Input
                            type="password"
                            {...register("password")}
                            id="password"
                            placeholder="Enter your password"
                            variant={errors.password ? "error" : "primary"}
                            customSize="sm"
                        >
                        </Input>
                        {errors.password && <ErrorField>{errors.password.message}</ErrorField>}
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <CardTitle className="font-thin text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Remember me
                            </CardTitle>
                        </div>
                    </CardContent >
                    <CardContent className="items-center">
                        <Button className="w-full" type="submit" variant="gradient" size="sm">
                            Login</Button>
                        <CardTitle className="font-thin text-sm ">
                            <a href="/signup" className="hover:underline"> Forgot password ?</a>
                        </CardTitle>
                    </CardContent>
                </form>
                <IconLogin></IconLogin>
            </CardBody>
            <CardFooter className="items-center">
                <CardTitle className="font-thin text-base">Don't have an account?
                    <a href="/signup" className="hover:underline "> Signup</a>
                </CardTitle>
            </CardFooter>
        </Card>
    )
}   