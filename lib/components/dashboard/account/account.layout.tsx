import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AccountLayoutProps {
    title: string;
    subTitle: string;
    children: React.ReactNode;
}

export function AccountLayout({
    subTitle,
    title,
    children,
}: Readonly<AccountLayoutProps>) {
    return (
        <Card className="container">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-base">
                    {subTitle}
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="mt-12">{children}</CardContent>
        </Card>
    );
}
