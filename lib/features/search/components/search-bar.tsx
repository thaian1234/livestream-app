"use client";

import { searchApi } from "../apis";
import { Search, X } from "lucide-react";
import React, { useRef } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { Input } from "@/components/ui/input";

export function SearchBar() {
    const debounced = useDebounceCallback(handleChange, 500);
    const inputRef = useRef<HTMLInputElement>(null);
    const { data, isPending, error } = searchApi.query.useSearch("1", "10", "");
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log("From debounced: ", e.target.value);
        console.log("From Ref: ", inputRef.current?.value);
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
                placeholder="Search"
                className="rounded-full border-0 bg-search px-10 text-white placeholder:text-white/70 focus-visible:ring-white"
                customSize="sm"
                onChange={debounced}
                ref={inputRef}
            />
            <button
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white"
                onClick={handleDeleteSearch}
                type="button"
            >
                <X size={20} />
            </button>
        </div>
    );
}
