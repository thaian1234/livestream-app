import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SearchBar } from "@/lib/features/search/components/search-bar";
import { useSidebar } from "@/lib/stores/store-sidebar";

import { TooltipModel } from "@/components/tooltip-model";

import { Actions } from "./actions";

export function Navbar() {
    const { onCollapseSidebar } = useSidebar();

    return (
        <nav className="sticky top-0 z-10 flex h-14 justify-between gap-1 bg-opacity-75 bg-gradient-to-r from-teal-2 to-black-1 px-4 sm:px-12">
            <div className="hidden items-center sm:flex">
                <Link href="/">
                    <Image
                        src="/logo-dark.svg"
                        alt="logo"
                        width={150}
                        height={100}
                    />
                </Link>
            </div>
            <div className="flex items-center sm:hidden">
                <TooltipModel content="Collapse" side="right">
                    <button onClick={onCollapseSidebar}>
                        <Menu
                            color="#ffffff"
                            strokeWidth={2.25}
                            className="my-3"
                        />
                    </button>
                </TooltipModel>
            </div>

            <div className="flex items-center justify-around gap-4 sm:gap-8">
                <SearchBar />
                <Actions />
            </div>
        </nav>
    );
}
