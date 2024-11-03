import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const paginationSchema = z.object({
    page: z.number().min(1).max(999999),
});

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const handlePrevious = () => {
        onPageChange(Math.max(currentPage - 1, 1));
    };

    const handleNext = () => {
        onPageChange(Math.min(currentPage + 1, totalPages));
    };

    const handlePageClick = () => {
        setIsEditing(true);
        setInputValue(currentPage.toString());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const result = paginationSchema.safeParse({
            page: parseInt(value, 10),
        });
        if (result.success || value === "") {
            setInputValue(value);
        }
    };

    const handleInputBlur = () => {
        handlePageSubmit();
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handlePageSubmit();
        }
    };

    const handlePageSubmit = () => {
        const result = paginationSchema.safeParse({
            page: parseInt(inputValue, 10),
        });

        if (result.success && result.data.page <= totalPages) {
            onPageChange(result.data.page);
        }
        setIsEditing(false);
    };

    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="gradient"
                size="icon"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="size-5" />
            </Button>
            {isEditing ? (
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    className="w-16 text-center"
                    autoFocus
                    aria-label={`Enter page number between 1 and ${totalPages}`}
                />
            ) : (
                <Button
                    variant="ghost"
                    onClick={handlePageClick}
                    className="text-sm"
                    aria-label={`Current page ${currentPage} of ${totalPages}. Click to change page.`}
                >
                    Page {currentPage} of {totalPages}
                </Button>
            )}
            <Button
                variant="gradient"
                size="icon"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="size-5" />
            </Button>
        </div>
    );
}
