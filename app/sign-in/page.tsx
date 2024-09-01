"use client";

import { useSession } from "@/lib/providers/session-provider";

import { LoginButton } from "@/components/login-button";

export default function SignInPage() {
    // const { isLoading, user, error } = useSession();
    // if (error) {
    //     return <div>{error.message}</div>;
    // }
    // if (isLoading || !user) {
    //     return <div>Loading...</div>;
    // }
    return (
        <div>
            {/* <div>{user.username}</div> */}
            <LoginButton />
        </div>
    );
}
