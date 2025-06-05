"use client";

import { CalendarEventExternal } from "@schedule-x/calendar";
import { format } from "date-fns";
import { useParams } from "next/navigation";

import { eventApi } from "@/lib/features/schedule/apis";
import { Schedule } from "@/lib/features/schedule/components/schedule";
import { AllVideoPreview } from "@/lib/features/video/components/all-video-preview";
import { CategoryVideoPreview } from "@/lib/features/video/components/category-video-preview";
import { useAuth } from "@/lib/providers/auth-provider";

import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = ["Home", "Video", "Schedule"] as const;

export function AboutTabs() {
    const auth = useAuth();
    const params = useParams<{ username: string }>();
    const eventQuery = eventApi.query.useGetAllEvents(
        params?.username as string,
    );

    if (eventQuery.isPending || !eventQuery.data) {
        return <Spinner size="large" />;
    }
    if (eventQuery.isError || !params) {
        return <div>Failed to fetch Eventa</div>;
    }

    const isOwner = auth?.user?.username === params.username;

    const events: CalendarEventExternal[] = eventQuery.data.data.map(
        (event) => ({
            id: event.id,
            description: event?.description || "",
            location: event?.location || "",
            start: format(event.start, "yyyy-MM-dd HH:mm"),
            end: format(event.end, "yyyy-MM-dd HH:mm"),
            title: event.title,
        }),
    );

    return (
        <Tabs defaultValue="Home" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-background pb-14">
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
            <TabsContent value="Schedule">
                <Schedule isOwner={isOwner} events={events} />
            </TabsContent>
        </Tabs>
    );
}
