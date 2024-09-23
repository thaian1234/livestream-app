"use client";

import { useState } from "react";

import { Fetcher } from "@/lib/helpers/fetcher";

import { client } from "@/server/api/client";

import { Button } from "../../components/ui/button";

function useUploadImageApi(file: File | null) {
    const $post = client.api.upload.avatar.$post;
    return Fetcher.useHonoMutation($post, {
        onSuccess(data) {
            if (!file) {
                throw new Error("Please select one file");
            }
            uploadToR2(data.data.signedUrl, file);
        },
        onError(err) {
            console.log(err);
        },
    });
}

async function uploadToR2(signedUrl: string, file: File) {
    try {
        const resp = await fetch(signedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });

        if (resp.ok) {
            console.log("File uploaded successfully to R2 Bucket");
        } else {
            console.error("Upload to R2 Bucket failed:", resp.statusText);
        }
    } catch (error) {
        console.error("Error during upload to R2 Bucket:", error);
    }
}

export function UploadButton() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { mutate, isPending } = useUploadImageApi(selectedFile);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            mutate({
                json: {
                    fileName: selectedFile.name,
                    fileSize: selectedFile.size,
                    fileType: selectedFile.type,
                },
            });
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <Button
                variant="gradient"
                onClick={handleUpload}
                disabled={!selectedFile || isPending}
            >
                Upload Image
            </Button>
        </form>
    );
}
