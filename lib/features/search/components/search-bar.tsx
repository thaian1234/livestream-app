"use client";

import { searchApi } from "../apis";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const dummyData: any[] = [
    { id: "1", title: "abc" },
    { id: "2", title: "def" },
    { id: "3", title: "ghi" },
    { id: "4", title: "jkl" },
    { id: "5", title: "mno" },
    { id: "6", title: "pqr" },
    { id: "7", title: "stu" },
    { id: "8", title: "vwx" },
    { id: "9", title: "yz" },
];
export function SearchBar() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
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
            setSearch("");
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputRef.current?.value) {
            console.log("Enter was pressed!", inputRef.current.value);
            router.push(
                `/search?search_query=${encodeURIComponent(inputRef.current.value)}`,
            );
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        console.log("Clicked suggestion: ", suggestion);
        if (inputRef.current) {
            inputRef.current.value = suggestion;
        }
        setSearch(suggestion);
        setShowSuggestions(false);
        router.push(`/search?search_query=${encodeURIComponent(suggestion)}`);
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
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                autoComplete="off"
            />
            <button
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white"
                onClick={handleDeleteSearch}
                type="button"
            >
                {isPending && search !== "" ? (
                    <Spinner size={"small"} />
                ) : (
                    <X size={20} />
                )}
            </button>
            {showSuggestions && dummyData && dummyData.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-black-1 shadow-lg">
                    {dummyData.map((item, index) => (
                        <div
                            key={index}
                            className="flex cursor-pointer space-x-2 px-3 py-2 hover:bg-white/10"
                            onClick={() => handleSuggestionClick(item.title)}
                        >
                            <Search className="h-5 w-5" />
                            <p className="text-sm">{item.title}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
