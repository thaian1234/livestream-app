"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { searchApi } from "../apis";

const DEBOUNCE_DELAY = 500;
const SUGGESTIONS_LIMIT = 3;

export function SearchBar() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { data, isPending } = searchApi.query.useSearch({
        filterBy: search,
        page: 1,
        size: SUGGESTIONS_LIMIT,
    });

    const debouncedSearch = useDebounceCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
        },
        DEBOUNCE_DELAY,
    );

    const handleClearSearch = () => {
        if (!inputRef.current) return;
        inputRef.current.value = "";
        setSearch("");
        setShowSuggestions(false);
    };

    const navigateToSearch = (searchTerm: string) => {
        console.log("searchTerm", searchTerm);
        router.push(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
        setShowSuggestions(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputRef.current?.value) {
            navigateToSearch(inputRef.current.value);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (inputRef.current) {
            inputRef.current.value = suggestion;
        }
        setSearch(suggestion);
        navigateToSearch(suggestion);
    };

    const streams = data?.data.data.streams || [];
    const users = data?.data.data.users || [];
    const hasSuggestions = streams.length > 0 || users.length > 0;

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white" />

            <Input
                ref={inputRef}
                id="search-input"
                placeholder="Search"
                className="rounded-full border-0 bg-search px-10 text-white placeholder:text-white/70 focus-visible:ring-white"
                customSize="sm"
                onChange={debouncedSearch}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
            />

            <button
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white"
                onClick={handleClearSearch}
                type="button"
            >
                {isPending && search ? (
                    <Spinner size="small" />
                ) : (
                    <X size={20} />
                )}
            </button>

            {showSuggestions && hasSuggestions && (
                <div className="absolute z-10 mt-3 w-full rounded-lg border border-slate-400 bg-black-1 py-2 shadow-lg">
                    {streams.map((stream, index) => (
                        <SuggestionItem
                            key={`stream-${index}`}
                            text={stream.name}
                            onClick={() => handleSuggestionClick(stream.name)}
                        />
                    ))}
                    {users.map((user, index) => (
                        <SuggestionItem
                            key={`user-${index}`}
                            text={user.username}
                            onClick={() => handleSuggestionClick(user.username)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function SuggestionItem({
    text,
    onClick,
}: {
    text: string;
    onClick: () => void;
}) {
    return (
        <div
            className="flex cursor-pointer space-x-2 px-3 py-2 hover:bg-white/10"
            onClick={onClick}
        >
            <Search className="h-5 w-5" />
            <p className="text-sm">{text}</p>
        </div>
    );
}
