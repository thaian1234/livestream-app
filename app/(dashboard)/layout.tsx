"use client";

import { Navbar } from "@/lib/components/dashboard/navbar";
import { Sidebar } from "@/lib/components/dashboard/sidebar";
import { useSidebarToggle } from "@/lib/stores/use-sidebar-toggle";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const sidebar = useSidebarToggle((state) => state);

    return (
        <>
            <Navbar />
            <Sidebar />
            <main
                className={cn(
                    "min-h-dvh bg-muted pl-14 transition-[margin-left] duration-300 ease-in-out",
                    sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
                )}
            >
                {children}
            </main>
        </>
    );
}
