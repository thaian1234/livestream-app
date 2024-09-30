"use client";

import { authApi } from "../apis";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";

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
        </>
    );
}
