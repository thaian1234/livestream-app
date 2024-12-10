"use client";

import { CheckSquare, Square } from "lucide-react";
import * as React from "react";

import { categoryApi } from "@/lib/features/category/apis";
import { useCategoryTree } from "@/lib/features/category/hooks/use-category-tree";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

const getAllCategoryIds = (categories: any[]): string[] => {
    return categories.reduce((acc: string[], category) => {
        acc.push(category.id);
        if (category.children && category.children.length > 0) {
            acc.push(...getAllCategoryIds(category.children));
        }
        return acc;
    }, []);
};

export function CategoryFilter() {
    const { data: categories, isPending } = categoryApi.query.useGetDetail({
        page: "1",
    });
    const { selectedIds, handleSelect, reset, handleSelectAll } =
        useCategoryTree();

    if (isPending) return <Spinner />;
    if (!categories) return <div>No categories found</div>;

    const allCategoryIds = getAllCategoryIds(categories.data.categories);

    return (
        <Accordion
            type="single"
            collapsible
            className="relative w-full max-w-sm"
        >
            <AccordionItem value="categories">
                <AccordionTrigger className="text-lg font-semibold">
                    Categories
                </AccordionTrigger>
                <AccordionContent>
                    <div className="absolute right-5 top-2 space-x-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSelectAll(allCategoryIds)}
                            title="Select All"
                        >
                            <CheckSquare className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => reset()}
                            title="Deselect All"
                        >
                            <Square className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {categories.data.categories.map((category) => (
                            <div key={category.id} className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={category.id}
                                        checked={selectedIds.includes(
                                            category.id,
                                        )}
                                        onCheckedChange={() =>
                                            handleSelect(category.id)
                                        }
                                    />
                                    <Label
                                        htmlFor={category.id}
                                        className="text-sm font-medium"
                                    >
                                        {category.name}
                                    </Label>
                                </div>
                                <div className="ml-6 space-y-2">
                                    {category.children &&
                                        category.children.map((subcategory) => (
                                            <div
                                                key={subcategory.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={subcategory.id}
                                                    checked={selectedIds.includes(
                                                        subcategory.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        handleSelect(
                                                            subcategory.id,
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={subcategory.id}
                                                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {subcategory.name}
                                                </Label>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
