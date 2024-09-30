import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";

interface CardSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function CardSection({
    title,
    description,
    children,
}: CardSectionProps) {
    return (
        <Card className="rounded-lg border-4 border-slate-700">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}
