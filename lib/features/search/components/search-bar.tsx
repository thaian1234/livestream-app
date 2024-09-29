"use client";

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

import { Input } from "@/components/ui/input";

export function SearchBar() {
    const [debounced, setValue] = useDebounceValue("", 500, { maxWait: 4 });
    useEffect(() => {
        console.log(debounced);
    }, [debounced]);
    return (
        <div className="relative">
            <Input
                type="search"
                placeholder="Search"
                className="rounded-full border-0 bg-search pr-10 text-white placeholder:text-white/70 focus-visible:ring-white"
                customSize="sm"
                defaultValue={""}
                onChange={(event) => setValue(event.target.value)}
            />
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white" />
        </div>
    );
}
