import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
    return (
        <Card className="rounded-none border-0 py-4 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="rounded-full bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tracking-tight">{value}</div>
            </CardContent>
        </Card>
    );
}
