"use client";

import { Sidebar } from "@/lib/components/dashboard/sidebar";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { useSidebarToggle } from "@/lib/stores/use-sidebar-toggle";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const sidebar = useSidebarToggle((state) => state);

    return (
        <ThemeProvider attribute="class" defaultTheme="dark">
            <Sidebar />
            <main
                className={cn(
                    "min-h-dvh bg-slate-800 pl-14 transition-[margin-left] duration-300 ease-in-out",
                    sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
                )}
            >
                {children}
            </main>
        </ThemeProvider>
    );
}
