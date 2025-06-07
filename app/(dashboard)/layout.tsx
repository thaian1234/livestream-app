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
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar />
                <main
                    className={cn(
                        "mx-auto flex-grow bg-muted px-1 py-2 transition-[margin-left] duration-300 ease-in-out sm:px-10",
                        sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
