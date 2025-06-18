"use client";

import { Navbar } from "@/lib/components/dashboard/navbar";
import { Sidebar } from "@/lib/components/dashboard/sidebar";
import { NotificationProvider } from "@/lib/providers/notification-provider";
import { StreamVideoContextProvider } from "@/lib/providers/stream-video-context-provider";
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
            <NotificationProvider>
                <Navbar />
            </NotificationProvider>
            <div className="flex flex-grow">
                <Sidebar />
                <main
                    className={cn(
                        "mx-auto flex-grow bg-muted px-1 py-2 transition-[margin-left] duration-300 ease-in-out sm:px-10",
                        sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
                    )}
                >
                    <StreamVideoContextProvider>
                        {children}
                    </StreamVideoContextProvider>
                </main>
            </div>
        </div>
    );
}
