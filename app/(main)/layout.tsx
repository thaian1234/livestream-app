import React from "react";

import Navbar from "@/lib/layouts/navbar/navbar";
import Sidebar from "@/lib/layouts/sidebar/sidebar";

import "@/style/home.css";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="containerHome">
            {/* navbar */}
            <Navbar />
            <div className="flex h-full overflow-hidden pt-6">
                {/* Sidebar */}
                <Sidebar />
                {/* Main content */}
                <main className="flex w-full flex-grow flex-wrap overflow-x-hidden bg-black-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
