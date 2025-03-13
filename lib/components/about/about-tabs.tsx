import { AllVideoPreview } from "@/lib/features/video/components/all-video-preview";
import { CategoryVideoPreview } from "@/lib/features/video/components/category-video-preview";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = ["Home", "Video", "Schedule"] as const;

export function AboutTabs() {
    return (
        <div className="">
            <Tabs defaultValue="Home" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-background pb-10">
                    {TABS.map((tab, index) => (
                        <TabsTrigger
                            className="rounded-none border-b border-white/50 bg-background duration-0 data-[state=active]:rounded-none data-[state=active]:border-b-4 data-[state=active]:border-teal-2 data-[state=active]:text-white"
                            value={tab}
                            key={index}
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="Home">
                    <CategoryVideoPreview />
                </TabsContent>
                <TabsContent value="Video">
                    <AllVideoPreview />
                </TabsContent>
                <TabsContent value="Schedule"></TabsContent>
            </Tabs>
        </div>
    );
}
