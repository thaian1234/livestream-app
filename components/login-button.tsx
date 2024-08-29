"use client";

import { useRouter } from "next/navigation";

import { client } from "@/server/api/client";

import { Button } from "./ui/button";

// Sigin
async function signIn() {
    const $post = client.api.auth["sign-in"].$post;
    const respSignin = await $post({
        json: {
            email: "test@test.com",
            password: "123456",
        },
    });
    if (!respSignin.ok) {
        const err = (await respSignin.json()).status;
        return;
    }
    const data = await respSignin.json();
    console.log("Sign in successfully");
}

export function LoginButton() {
    const router = useRouter();
    async function signUp() {
        const $post = client.api.auth["sign-up"].$post;
        const respSignup = await $post({
            json: {
                email: "test1234@test.com",
                username: "thaian1",
                password: "123456",
            },
        });
        if (!respSignup.ok) {
            const err = (await respSignup.json()).msg;
            return;
        }
        console.log("Sign up successfully");
        router.refresh();
    }
    return (
        <div>
            <Button onClick={signIn}>Signin Button</Button>;
            <Button onClick={signUp}>Signup Button</Button>
        </div>
    );
}
