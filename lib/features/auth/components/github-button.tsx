"use client";

import { FaGithub } from "react-icons/fa";

import { authApi } from "../apis";

export function GithubButton() {
    const { mutate: handleSignInGithub, isPending } =
        authApi.mutation.useSignInGithub();

    return (
        <button onClick={handleSignInGithub} disabled={isPending}>
            <FaGithub size={35} />
        </button>
    );
}
