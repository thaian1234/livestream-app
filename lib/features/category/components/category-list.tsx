"use client";

import { categoryApi } from "../apis";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

interface Category {
    id: number;
    title: string;
    imageUrl: string;
    tags: string[];
}

const categories: Category[] = [
    {
        id: 1,
        title: "Just Chatting",
        imageUrl: "/placeholder.svg?height=136&width=96",
        tags: ["IRL"],
    },
    {
        id: 2,
        title: "League of Legends",
        imageUrl: "/placeholder.svg?height=136&width=96",
        tags: ["MOBA", "Action"],
    },
    {
        id: 3,
        title: "VALORANT",
        imageUrl: "/placeholder.svg?height=136&width=96",
        tags: ["FPS", "Shooter"],
    },
    {
        id: 4,
        title: "Grand Theft Auto V",
        imageUrl: "/placeholder.svg?height=136&width=96",
        tags: ["Adventure", "Action"],
    },
    {
        id: 5,
        title: "Minecraft",
        imageUrl: "/placeholder.svg?height=136&width=96",
        tags: ["Adventure", "Sandbox"],
    },
    {
        id: 6,
        title: "Counter-Strike: Global Offensive",
        imageUrl: "/placeholder.svg?height=136&width=96",
        tags: ["FPS", "Shooter"],
    },
];

export function CategoryList() {
    const { data, isPending, isError } = categoryApi.query.useGetDetail();

    if (isPending) {
        return <p>Loading category</p>;
    }
    if (!data || isError) {
        return <p>Failed to load category</p>;
    }

    const categories = data.data.categories;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">Categories</h1>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {categories.map((category) => (
                    <Card
                        key={category.id}
                        className="overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                    >
                        <div className="group">
                            <CardContent className="p-0">
                                <div className="relative w-full bg-white pt-[140%]">
                                    {category.imageUrl ? (
                                        <Image
                                            src={category.imageUrl}
                                            alt={category.name}
                                            width={96}
                                            height={136}
                                            className="w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-2">
                                    <h2 className="mb-2 truncate text-sm font-semibold transition-colors duration-300 ease-in-out group-hover:text-primary">
                                        {category.name}
                                    </h2>
                                    <div className="flex flex-wrap gap-1">
                                        {category.parent ? (
                                            <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                                                {category.parent.name}
                                            </span>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}