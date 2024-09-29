import Image from "next/image";
import Link from "next/link";

import { SearchBar } from "@/lib/features/search/components/search-bar";

import { Actions } from "./actions";

export function Navbar() {
    return (
        <nav className="max-w-screen-w flex h-14 justify-between bg-opacity-75 bg-gradient-to-r from-teal-2 to-black-1 px-6">
            <div className="flex items-center">
                <Link href="/">
                    <Image
                        src="/logoipsum-330.svg"
                        alt="logo"
                        width={150}
                        height={100}
                    />
                </Link>
            </div>
            <div className="flex items-center justify-around space-x-8">
                <SearchBar />
                <div />
                <Actions />
            </div>
        </nav>
    );
}
