"use client";

import React from "react";

import { Navbar } from "@/lib/components/navbar";
import { Sidebar } from "@/lib/components/sidebar";
import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import "@/style/home.css";

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
            <div className="flex flex-grow pt-6">
                <Sidebar />
                {/* Main content */}
                <main
                    className={cn(
                        "flex-grow bg-black-1 pb-12 transition-[margin-left] duration-300 ease-in-out",
                        sidebar.isOpenSidebar ? "lg:ml-72" : "lg:ml-[90px]",
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
