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
import { Spinner } from "@/components/ui/spinner";
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
                        onClick={(e) => {
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                    />
                </PaginationItem>

                {startPage > 1 && (
                    <>
                        <PaginationItem>
                            <PaginationLink
                                onClick={(e) => {
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
                            isActive={page === currentPage}
                            onClick={(e) => {
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
                                onClick={(e) => {
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
                        onClick={(e) => {
                            if (currentPage < totalPages)
                                onPageChange(currentPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

const TABS = ["All", "Channel"] as const;
const SIZE = 4;

export default function SearchPage() {
    const { selectedIds } = useCategoryTree();
    const [currentPage, setCurrentPage] = useQueryState("page", {
        defaultValue: "1",
        throttleMs: 500,
        clearOnDefault: false,
        shallow: true,
    });

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("searchTerm");

    const { data, error, isPending } = searchApi.query.useSearch({
        filterBy: searchQuery,
        page: parseInt(currentPage),
        size: SIZE,
        categoryIds: selectedIds,
    });

    if (isPending) return <Spinner />;
    if (error || !data) return <p>Something went wrong</p>;

    const { streams, users } = data.data.data;
    const { currentPage: page, totalPages } = data.data.pagination;

    const handleChangePage = (page: number) => {
        setCurrentPage(page.toString());
    };

    return (
        <section className="relative">
            <div className="fixed right-10 z-50 flex min-w-72 items-center justify-center rounded-lg border border-slate-500 bg-black-1 p-3">
                <CategoryFilter />
            </div>
            <Tabs defaultValue="All" className="w-full space-y-12 px-[70px]">
                <TabsList className="mb-8 grid w-[200px] grid-cols-2 space-x-4 bg-transparent">
                    {TABS.map((tabName, index) => (
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
                        {!selectedIds?.length && users && (
                            <>
                                <p className="text-2xl">User</p>
                                <div className="flex flex-col">
                                    <UserPreview users={users} />
                                </div>
                            </>
                        )}
                        <p className="text-2xl">Channel</p>
                        <div className="flex flex-col space-y-4">
                            <LivesPreview streams={streams} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="Channel">
                    <div className="flex flex-col space-y-4">
                        <LivesPreview streams={streams} />
                    </div>
                </TabsContent>
                <PaginationComponent
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handleChangePage}
                />
            </Tabs>
        </section>
    );
}
