"use client";

import { storageApi } from "@/lib/features/storage/apis";
import { StorageStats } from "@/lib/features/storage/components/stats/storage-stats";
import { StorageTable } from "@/lib/features/storage/components/storage-table";
import { dummyStorageData } from "@/lib/features/storage/types/storage";
import { UploadVideoFormDialog } from "@/lib/features/upload/components/upload-video-form-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function StudioPage() {
    return (
        <Card className="mx-auto max-w-screen-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Storage content</CardTitle>
                <UploadVideoFormDialog />
            </CardHeader>
            <CardContent>
                <StorageStats />
                <StorageTable />
            </CardContent>
        </Card>
    );
}
