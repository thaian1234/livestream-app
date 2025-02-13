import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function EditVideoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Card className="mx-auto max-w-screen-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-2">
                    <CardTitle>Video details</CardTitle>
                    <CardDescription>Manage your video details</CardDescription>
                </div>
            </CardHeader>
            <Separator />
            <CardContent>{children}</CardContent>
        </Card>
    );
}
