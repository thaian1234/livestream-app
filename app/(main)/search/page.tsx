"use client";

import { ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { UserPreview } from "@/lib/components/profile/search/user-preview";
import { LivesPreview } from "@/lib/features/stream/components/live-preview";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("General");
    //  giá trị của 'search_query' là tham số tìm kiếm
    const searchQuery = searchParams.get("search_query");

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };
    return (
        <ScrollArea className="h-[calc(100vh-5rem)] w-full">
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full px-10"
            >
                <TabsList className="mb-8 grid w-[300px] grid-cols-3 space-x-4 bg-black-1">
                    <TabsTrigger
                        className="w-auto rounded-full bg-search text-white data-[state=active]:bg-teal-2"
                        value="General"
                    >
                        General
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-auto rounded-full bg-search text-white data-[state=active]:bg-teal-2"
                        value="Live"
                    >
                        Live
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-auto rounded-full bg-search text-white data-[state=active]:bg-teal-2"
                        value="Channel"
                    >
                        Channel
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="General">
                    <div className="flex justify-between py-2">
                        <p className="text-2xl">Channel</p>
                        <button
                            className="flex items-center text-base hover:text-lg"
                            onClick={() => handleTabChange("Channel")}
                        >
                            <p>Show all</p>
                            <ChevronRight />
                        </button>
                    </div>
                    <div className="grid gap-6 min-[712px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        <UserPreview limit={4} />
                    </div>

                    <div className="flex justify-between py-2">
                        <p className="text-2xl">Live</p>
                        <button
                            className="flex items-center text-base hover:text-lg"
                            onClick={() => handleTabChange("Live")}
                        >
                            <p>Show all</p>
                            <ChevronRight />
                        </button>
                    </div>
                    <div className="grid gap-6 min-[712px]:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                        <LivesPreview limit={3} />
                    </div>
                </TabsContent>
                <TabsContent value="Live">
                    <div className="grid gap-6 min-[712px]:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                        <LivesPreview />
                    </div>
                </TabsContent>
                <TabsContent value="Channel">
                    <div className="grid gap-10 min-[712px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        <UserPreview />
                    </div>
                </TabsContent>
            </Tabs>
        </ScrollArea>
    );
}
