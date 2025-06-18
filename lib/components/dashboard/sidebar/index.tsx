import { PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { useSidebarToggle } from "@/lib/stores/use-sidebar-toggle";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";

export function Sidebar() {
    const sidebar = useSidebarToggle((state) => state);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
                sidebar?.isOpen === false ? "w-[90px]" : "w-72",
            )}
        >
            <SidebarToggle
                isOpen={sidebar?.isOpen}
                setIsOpen={sidebar?.setIsOpen}
            />
            <div className="relative flex h-dvh flex-col px-3 py-4 shadow-md dark:shadow-zinc-800">
                <Button
                    className={cn(
                        "mb-1 transition-transform duration-300 ease-in-out",
                        sidebar?.isOpen === false
                            ? "translate-x-1"
                            : "translate-x-0",
                    )}
                    variant="link"
                    asChild
                >
                    <div className="flex items-center gap-2">
                        <PanelsTopLeft className="mr-1 h-6 w-6" />
                        <h1
                            className={cn(
                                "whitespace-nowrap text-lg font-bold transition-[transform,opacity,display] duration-300 ease-in-out",
                                sidebar?.isOpen === false
                                    ? "hidden -translate-x-96 opacity-0"
                                    : "translate-x-0 opacity-100",
                            )}
                        >
                            Dashboard
                        </h1>
                    </div>
                </Button>
                <Suspense fallback={<p>loading sidebar...</p>}>
                    <Menu isOpen={sidebar?.isOpen} />
                </Suspense>
            </div>
        </aside>
    );
}
