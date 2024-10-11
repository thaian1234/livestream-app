"use client";

import { searchApi } from "../apis";
import { Search, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function SearchBar() {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const debounced = useDebounceCallback(handleChange, 500);
    const { data, isPending, error } = searchApi.query.useSearch(
        "1",
        "10",
        search,
    );
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log("From debounced: ", e.target.value);
        setSearch(e.target.value);
    }

    const handleDeleteSearch = () => {
        if (inputRef.current?.value) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white" />
            <Input
                id="test"
                placeholder="Search"
                className="rounded-full border-0 bg-search px-10 text-white placeholder:text-white/70 focus-visible:ring-white"
                customSize="sm"
                ref={inputRef}
                onChange={debounced}
            />
            <button
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white"
                onClick={handleDeleteSearch}
                type="button"
            >
                {isPending ? <Spinner size={"small"} /> : <X size={20} />}
            </button>
        </div>
    );
}
