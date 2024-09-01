"use client";

import Link from "next/link";

import { useSession } from "@/lib/providers/session-provider";

export function Navbar() {
    const { isSignedIn, isLoading, user } = useSession();
    if (isLoading || !user) {
        return <div>Loading ...</div>;
    }
    return (
        <div className="flex flex-col space-y-4">
            <Link href={"/home"}>Home</Link>
            <Link href={"/settings"}>Settings</Link>
            <Link href={"/users"}>Users</Link>
            <Link href={"/community"}>Community</Link>
            <div className="flex flex-col space-y-4">
                <p>User: {user.email}</p>
                <p>Is signed in: {isSignedIn ? "Signed in" : "Signed out"}</p>
            </div>
        </div>
    );
}
