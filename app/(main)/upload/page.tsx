"use client";

import { authApi } from "@/lib/cores/auth/apis";
import { UploadButton } from "@/lib/cores/upload-btn";

export default function UploadPage() {
    const { data, isPending, isError, error } = authApi.query.useGetUser();
    if (isError) {
        <p>{error.message}</p>;
    }
    console.log(data);
    return (
        <div className="flex flex-col space-y-4">
            <UploadButton />
        </div>
    );
}
