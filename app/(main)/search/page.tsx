"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { UserPreview } from "@/lib/components/profile/search/user-preview";
import { searchApi } from "@/lib/features/search/apis";
import { LivesPreview } from "@/lib/features/search/components/live-preview";
import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("All");
    //  giá trị của 'search_query' là tham số tìm kiếm
    const searchQuery = searchParams.get("searchTerm");
    const { data, error, isPending } = searchApi.query.useSearch(
        "1",
        "10",
        searchQuery || "",
    );
    const tabs = ["All", "Live", "Channel"];
    const { isOpenSidebar } = useSidebar();

    if (data === undefined || isPending) return <Loader2 />;

    if (error) return <p>Something went wrong</p>;

    return (
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
                        <p className="text-2xl">Channel</p>
                        <div className="flex max-w-[700px] flex-col">
                            <UserPreview users={data.data.users} limit={4} />
                        </div>

                        <p className="text-2xl">Live</p>
                        <div className="flex flex-col space-y-4">
                            <LivesPreview streams={data.data.streams}/>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="Live">
                    <div className="flex flex-col space-y-4">
                        <LivesPreview streams={data.data.streams} />
                    </div>
                </TabsContent>
                <TabsContent value="Channel">
                    <div className="flex max-w-[700px] flex-col">
                        <UserPreview users={data.data.users}/>
                    </div>
                </TabsContent>
            </Tabs>
    );
}
