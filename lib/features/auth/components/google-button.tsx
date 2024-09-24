"use client";

import { authApi } from "../apis";
import { FaGoogle } from "react-icons/fa";

export function GoogleButton() {
    const { mutate: handleSignIn, isPending } =
        authApi.mutation.useSignInGoogle();

    return (
        <button disabled={isPending} onClick={handleSignIn}>
            <FaGoogle size={35} />
        </button>
    );
}
