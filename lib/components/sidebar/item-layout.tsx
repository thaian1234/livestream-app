import Link from "next/link";

import { CardContent, CardTitle } from "@/components/ui/card";

interface Props {
    children: React.ReactNode; // Chỉ nhận các component React
    title: string;
    link: string;
}

export function ItemLayout({ children, title, link }: Props) {
    return (
        <CardContent className="space-y-0">
            <Link
                href={link}
                className="group block transition-colors hover:text-white/90"
            >
                <CardTitle className="py-2 text-lg font-semibold transition-transform group-hover:translate-x-1">
                    {title}
                </CardTitle>
            </Link>
            {children}
        </CardContent>
    );
}
