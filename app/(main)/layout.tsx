import "@/style/home.css"
import React from 'react'
import Navbar from "@/components/navbar/navbar"
import Sidebar from "@/components/sidebar/sidebar"


export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="containerHome ">
            {/* navbar */}
            <Navbar></Navbar>
            <div className="flex overflow-hidden h-full pt-6">
                {/* Sidebar */}
                <Sidebar />
                {/* Main content */}
                <main className="flex-grow overflow-x-hidden overflow-y-auto bg-black-1">
                    {children}
                </main>
            </div>
        </div>
    )
}