"use client";

import { authApi } from "../apis";
import { FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";

export function GoogleButton() {
    const { mutate: handleSignIn, isPending } =
        authApi.mutation.useSignInGoogle();

    return (
        <Button disabled={isPending} onClick={handleSignIn}>
            <FaGoogle size={35} />
        </Button>
    );
}
