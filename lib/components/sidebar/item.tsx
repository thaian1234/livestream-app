import { title } from "process";
import { Children } from "react";

import { CardContent, CardTitle } from "@/components/ui/card";

interface Props {
    children: React.ReactNode; // Chỉ nhận các component React
    title: String;
}
export function Item({ children, title }: Props) {
    return (
        <CardContent className="space-y-0 border-t border-white/40">
            <CardTitle className="py-2 text-lg font-medium">{title}</CardTitle>
            {children}
        </CardContent>
    );
}
