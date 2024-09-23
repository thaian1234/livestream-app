"use client";

import { authApi } from "../apis";
import { FaGithub } from "react-icons/fa";

export function GithubButton() {
    const { mutate: handleSignInGithub, isPending } =
        authApi.mutation.useSignInGithub();

    return (
        <button onClick={handleSignInGithub} disabled={isPending}>
            <FaGithub size={35} />
        </button>
    );
}
