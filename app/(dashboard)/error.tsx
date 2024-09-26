"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function DashboardErrorPage() {
    return (
        <Link href={"/"}>
            <Button>Go back home</Button>;
        </Link>
    );
}
