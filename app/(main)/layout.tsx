"use client";

import "@/style/home.css";
import React from "react";

import { Navbar } from "@/lib/components/navbar";
import { Sidebar } from "@/lib/components/sidebar";
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
            {/* navbar */}
            <Navbar />
            {/* Sidebar */}
            <div className="flex flex-grow">
                <Sidebar />
                {/* Main content */}
                <main
                    className={cn(
                        "flex-grow py-6 pr-6 transition-[margin-left] duration-300 ease-in-out",
                        sidebar.isOpenSidebar ? "lg:ml-80" : "lg:ml-[90px]",
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
