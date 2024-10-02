"use client";

import { streamApi } from "../apis";

import { Spinner } from "@/components/ui/spinner";

interface KeyFormProps {}

export function KeyForm({}: KeyFormProps) {
    const { data, isPending } = streamApi.query.useGetMyStream();
    if (isPending) {
        return <Spinner />;
    }
    return <div>KeyForm</div>;
}
