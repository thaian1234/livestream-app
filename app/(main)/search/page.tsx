"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";

import { UserPreview } from "@/lib/components/profile/search/user-preview";
import { useCategoryTree } from "@/lib/features/category/hooks/use-category-tree";
import { searchApi } from "@/lib/features/search/apis";
import { LivesPreview } from "@/lib/features/search/components/live-preview";

import { CategoryFilter } from "@/components/category-filter";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function PaginationComponent({
    totalPages,
    currentPage,
    onPageChange,
}: {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}) {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const pageNumbers = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i,
    );

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                    />
                </PaginationItem>

                {startPage > 1 && (
                    <>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(1);
                                }}
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                        {startPage > 2 && <PaginationEllipsis />}
                    </>
                )}

                {pageNumbers.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(page);
                            }}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <PaginationEllipsis />}
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(totalPages);
                                }}
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                                onPageChange(currentPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default function SearchPage() {
    const [currentPage, setCurrentPage] = useQueryState("page", {
        defaultValue: "1",
        throttleMs: 500,
        clearOnDefault: false,
        shallow: false,
    });
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("searchTerm");
    const { data, error, isPending } = searchApi.query.useSearch({
        filterBy: searchQuery,
        page: parseInt(currentPage),
        size: 4,
    });
    const tabs = ["All", "Live", "Channel"];

    if (data === undefined || isPending) return <Loader2 />;
    if (error) return <p>Something went wrong</p>;
    const streams = data.data.data.streams;

    const handleChangePage = (page: number) => {
        setCurrentPage(page.toString());
    };

    return (
        <section className="relative">
            <div className="absolute right-1/4 top-0 flex min-w-72 items-center justify-center rounded-lg border border-slate-500 p-4">
                <CategoryFilter />
            </div>
            <Tabs defaultValue="All" className="w-full px-10">
                <TabsList className="mb-8 grid w-[300px] grid-cols-3 space-x-4 bg-black-1">
                    {tabs.map((tabName, index) => (
                        <TabsTrigger
                            className="w-auto rounded-full bg-search text-white data-[state=active]:bg-teal-2"
                            value={tabName}
                            key={index}
                        >
                            {tabName}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="All">
                    <div className="space-y-4">
                        <p className="text-2xl">User</p>
                        <div className="flex max-w-[700px] flex-col">
                            <UserPreview
                                users={data.data.data.users}
                                limit={4}
                            />
                        </div>

                        <p className="text-2xl">Channel</p>
                        <div className="flex flex-col space-y-4">
                            <LivesPreview streams={streams} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="User">
                    <div className="flex flex-col space-y-4">
                        <LivesPreview streams={streams} />
                    </div>
                </TabsContent>
                <TabsContent value="Channel">
                    <div className="flex max-w-[700px] flex-col">
                        <UserPreview users={data.data.data.users} />
                    </div>
                </TabsContent>
                <PaginationComponent
                    currentPage={data.data.pagination.currentPage}
                    totalPages={data.data.pagination.totalPages}
                    onPageChange={handleChangePage}
                />
            </Tabs>
        </section>
    );
}
