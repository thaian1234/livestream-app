"use client";

import { FaGoogle } from "react-icons/fa";

import { authApi } from "../apis";

export function GoogleButton() {
    const { mutate: handleSignIn, isPending } =
        authApi.mutation.useSignInGoogle();

    return (
        <button disabled={isPending} onClick={handleSignIn}>
            <FaGoogle size={35} />
        </button>
    );
}
