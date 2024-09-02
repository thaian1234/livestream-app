"use client";

import Link from "next/link";

import { clientAPI } from "@/lib/features";
import { useAuth } from "@/lib/providers/auth-provider";

import { Button } from "./ui/button";

export function Navbar() {
    const { isSignedIn, isLoading, user } = useAuth();
    const { useSignIn, useSignOut } = clientAPI.auth;
    const { mutate: signIn } = useSignIn();
    const { mutate: signOut } = useSignOut();
    if (isLoading) {
        return <div>Loading ...</div>;
    }
    const handleSignIn = () => {
        signIn({
            json: {
                email: "test@test123.com",
                password: "123456",
            },
        });
    };
    const handleSignOut = () => {
        signOut({});
    };

    return (
        <div className="flex flex-col space-y-4">
            <Link href={"/home"}>Home</Link>
            <Link href={"/settings"}>Settings</Link>
            <Link href={"/users"}>Users</Link>
            <Link href={"/community"}>Community</Link>
            <div className="flex flex-col space-y-4">
                <p>User: {user && user.email}</p>
                {isSignedIn ? (
                    <Button onClick={handleSignOut}>Sign out</Button>
                ) : (
                    <Button onClick={handleSignIn}>Sign in</Button>
                )}
            </div>
        </div>
    );
}
