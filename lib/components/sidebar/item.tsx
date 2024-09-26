import Link from "next/link";
import { title } from "process";
import { Children } from "react";

import { CardContent, CardTitle } from "@/components/ui/card";

interface Props {
    children: React.ReactNode; // Chỉ nhận các component React
    title: string;
    link: string;
}
export function Item({ children, title, link }: Props) {
    return (
        <CardContent className="space-y-0 border-t border-white/40">
            <Link href={link}>
                <CardTitle className="py-2 text-lg font-medium">
                    {title}
                </CardTitle>
            </Link>
            {children}
        </CardContent>
    );
}
