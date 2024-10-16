"use client";

import { ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { UserPreview } from "@/lib/components/profile/search/user-preview";
import { LivesPreview } from "@/lib/features/stream/components/live-preview/search/live-preview";
import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("All");
    //  giá trị của 'search_query' là tham số tìm kiếm
    const searchQuery = searchParams.get("search_query");

    const { isOpenSidebar } = useSidebar();
    return (
        <ScrollArea
            className={cn(
                "h-[calc(100vh-5rem)] w-full",
                isOpenSidebar ? "" : "ml-20",
            )}
        >
            <Tabs defaultValue="All" className="w-full px-10">
                <TabsList className="mb-8 grid w-[300px] grid-cols-3 space-x-4 bg-black-1">
                    <TabsTrigger
                        className="w-auto rounded-full bg-search text-white data-[state=active]:bg-teal-2"
                        value="All"
                    >
                        All
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
                <TabsContent value="All">
                    <div className="space-y-4">
                        <p className="text-2xl">Channel</p>
                        <div className="flex flex-col space-y-4">
                            <UserPreview limit={4} />
                        </div>

                        <p className="text-2xl">Live</p>
                        <div className="flex flex-col space-y-4">
                            <LivesPreview />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="Live">
                    <div className="flex flex-col space-y-4">
                        <LivesPreview />
                    </div>
                </TabsContent>
                <TabsContent value="Channel">
                    <div className="flex flex-col space-y-4">
                        <UserPreview />
                    </div>
                </TabsContent>
            </Tabs>
        </ScrollArea>
    );
}
