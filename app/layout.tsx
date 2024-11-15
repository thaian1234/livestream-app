import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { AuthProvider } from "@/lib/providers/auth-provider";
import ReactQueryProvider from "@/lib/providers/react-query-provider";
import { ThemeProvider } from "@/lib/providers/theme-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ReactQueryProvider>
                    <AuthProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                        >
                            <NuqsAdapter>
                                <Toaster theme="light" />
                                {children}
                            </NuqsAdapter>
                        </ThemeProvider>
                    </AuthProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
