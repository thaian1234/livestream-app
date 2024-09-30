"use client";

import { searchApi } from "../apis";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { Input } from "@/components/ui/input";

export function SearchBar() {
    const debounced = useDebounceCallback(handleChange, 500);
    const [search, setSearch] = useState("");
    const { data, isPending, error } = searchApi.query.useSearch(
        "1",
        "10",
        search,
    );
    if (!isPending) console.log(data);
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const search = e.target.value;
        console.log(e.target.value);
        setSearch(search);
        console.log("Waiting for 500ms");
    }

    return (
        <div className="relative">
            <Input
                type="search"
                placeholder="Search"
                className="rounded-full border-0 bg-search pr-10 text-white placeholder:text-white/70 focus-visible:ring-white"
                customSize="sm"
                defaultValue=""
                onChange={debounced}
            />
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white" />
        </div>
    );
}
