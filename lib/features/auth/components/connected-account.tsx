"use client";

import { authApi } from "../apis";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function ConnectedAccount() {
    const { mutate: handleGoogleSignIn, isPending: isGoolePending } =
        authApi.mutation.useSignInGoogle();
    const { mutate: handleGithubSignIn, isPending: isGithubPending } =
        authApi.mutation.useSignInGithub();
    const isSigning = isGoolePending || isGithubPending;

    return (
        <Card className="rounded-lg border-2">
            <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                    Manage your connected services
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    disabled={isSigning}
                    onClick={handleGoogleSignIn}
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                >
                    <FaGoogle className="mr-4 size-4" />
                    Connect to Google
                </Button>
                <Button
                    disabled={isSigning}
                    onClick={handleGithubSignIn}
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                >
                    <FaGithub className="mr-4 size-4" />
                    Connect to GitHub
                </Button>
            </CardContent>
        </Card>
    );
}
