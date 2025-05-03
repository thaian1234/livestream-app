import { DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IAnalysisItemProps {
    title: string;
    amount: string;
    subtitle?: string;
}

export function AnalysisCard({ title, amount, subtitle }: IAnalysisItemProps) {
    return (
        <Card className="flex flex-col rounded-lg border border-white/30 py-4 pl-6 pr-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold">{amount}</div>
                {subtitle && subtitle !== "" && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
}
