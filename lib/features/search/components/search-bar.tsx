"use client";

import { searchApi } from "../apis";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { Input } from "@/components/ui/input";

export function SearchBar() {
    const debounced = useDebounceCallback(searchText, 500);
    const [search, setSearch] = useState("");
    const [input, setInput] = useState("");
    const { data, isPending, error } = searchApi.query.useSearch(
        "1",
        "10",
        search,
    );
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        debounced(e.target.value);
    };

    //search
    function searchText(value: string) {
        setSearch(value);
        console.log("Waiting for 500ms  " + value);
    }

    const deleteSearchInput = () => {
        setInput("");
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white" />
            <Input
                placeholder="Search"
                className="rounded-full border-0 bg-search px-10 text-white placeholder:text-white/70 focus-visible:ring-white"
                customSize="sm"
                value={input}
                onChange={handleChange}
            />
            {input !== "" && (
                <button
                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white"
                    onClick={deleteSearchInput}
                >
                    <X size={20} />
                </button>
            )}
        </div>
    );
}
