import { StorageStats } from "@/lib/features/storage/components/stats/storage-stats";
import { StorageTable } from "@/lib/features/storage/components/storage-table";
import { dummyStorageData } from "@/lib/features/storage/types/storage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudioPage() {
    return (
        <Card className="mx-auto max-w-screen-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Storage content</CardTitle>
            </CardHeader>
            <CardContent>
                <StorageStats data={dummyStorageData} />
                <StorageTable />
            </CardContent>
        </Card>
    );
}
