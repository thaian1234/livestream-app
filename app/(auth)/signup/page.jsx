'use client'

import { clientAPI } from "@/lib/features";

import { LoginButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardBody } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { IconLogin } from "@/components/auth/iconLogin";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "@/style/auth.css"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorField } from "@/components/errorField";

const schema = yup.object().shape({
    username: yup.string().required("Username is required"), //thêm không được trùng với người khác
    email: yup.string()
        .email("Invalid email")
        .required("Email is required"),
    password: yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

export default function Page() {
    const {
        register, // register field name
        handleSubmit, //pass a callback to handle successful
        formState: { errors },
        getValues   //get values from
    } = useForm({
        resolver: yupResolver(schema), //handle errors
    });
    const submitHandler = (data) => {
        // thêm đoạn code gửi email đăng ký
        console.log(data.username + " " + data.email + " " + data.password + " " + data.confirmPassword);
    }
    return (
        <Card style={{ justifyContent: "space-between" }}  >
            <CardBody>
                <CardHeader>
                    <CardTitle>Signup</CardTitle>
                    <CardTitle className="font-thin text-sm">Just some details to get you in.!</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <CardContent>
                        <Input
                            id="username"
                            placeholder="Username"
                            variant={errors.username ? "error" : "primary"}
                            customSize="sm"
                            {...register("username")}
                        />
                        {errors.username && <ErrorField>{errors.username.message}</ErrorField>}
                        <Input
                            type="email"
                            id="email"
                            placeholder="Email"
                            variant={errors.email ? "error" : "primary"}
                            customSize="sm"
                            {...register("email")}
                        />
                        {errors.email && <ErrorField>{errors.email.message}</ErrorField>}
                        <Input
                            type="password"
                            id="password"
                            placeholder="Password"
                            variant={errors.password ? "error" : "primary"}
                            customSize="sm"
                            {...register("password")}
                        />
                        {errors.password && <ErrorField>{errors.password.message}</ErrorField>}

                        <Input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            variant={errors.confirmPassword ? "error" : "primary"}
                            customSize="sm"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && <ErrorField>{errors.confirmPassword.message}</ErrorField>}

                    </CardContent>
                    <CardContent>
                        <Button className="w-full" type="submit" variant="gradient" size="sm">Signup</Button>
                    </CardContent>
                </form>
                <IconLogin></IconLogin>
            </CardBody>
            <CardFooter className="items-center">
                <CardTitle className="font-thin text-base ">Already Registered?
                    <a href="/login" className="hover:underline"> Login</a>
                </CardTitle>
            </CardFooter>
        </Card>

    )
}   