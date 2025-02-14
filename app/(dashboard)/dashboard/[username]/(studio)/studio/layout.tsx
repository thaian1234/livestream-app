import { CreateVideoDialog } from "@/lib/features/video/components/create-video-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudioLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Card className="mx-auto max-w-screen-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Channel content</CardTitle>
                <CreateVideoDialog />
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
