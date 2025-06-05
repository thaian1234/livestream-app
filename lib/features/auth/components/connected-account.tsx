"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";

import { authApi } from "../apis";

export function ConnectedAccount() {
    const { mutate: handleGoogleSignIn, isPending: isGoolePending } =
        authApi.mutation.useSignInGoogle();
    const { mutate: handleGithubSignIn, isPending: isGithubPending } =
        authApi.mutation.useSignInGithub();
    const isSigning = isGoolePending || isGithubPending;

    return (
        <>
            <Button
                disabled={isSigning}
                onClick={handleGoogleSignIn}
                type="button"
                variant="default"
                className="w-full justify-start"
            >
                <FaGoogle className="mr-4 size-4" />
                Connect to Google
            </Button>
            <Button
                disabled={isSigning}
                onClick={handleGithubSignIn}
                type="button"
                variant="default"
                className="w-full justify-start"
            >
                <FaGithub className="mr-4 size-4" />
                Connect to GitHub
            </Button>
        </>
    );
}
