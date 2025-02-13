import { CreateVideoButton } from "@/lib/features/video/components/create-video-btn";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudioLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Card className="max-w-screen-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Channel content</CardTitle>
                <CreateVideoButton />
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
