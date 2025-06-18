"use client";

import "@/style/home.css";
import React from "react";

import { Navbar } from "@/lib/components/navbar";
import { Sidebar } from "@/lib/components/sidebar";
import { NotificationProvider } from "@/lib/providers/notification-provider";
import { StreamVideoContextProvider } from "@/lib/providers/stream-video-context-provider";
import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sidebar = useSidebar();

    return (
        <div className="flex min-h-screen flex-col">
            <NotificationProvider>
                {/* navbar */}
                <Navbar />
            </NotificationProvider>
            {/* Sidebar */}
            <div className="flex flex-grow">
                <Sidebar />
                {/* Main content */}
                <main
                    className={cn(
                        "flex-grow px-1 py-6 transition-[margin-left] duration-300 ease-in-out sm:pr-6",
                        sidebar.isOpenSidebar
                            ? "sm:pl-4 lg:pl-80"
                            : "sm:pl-[90px]",
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
