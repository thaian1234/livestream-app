"use client";

import { Menu } from "lucide-react";

import { CollapseSidebar } from "@/lib/features/following/components/sidebar/collapse-sidebar";
import { FollowingSidebar } from "@/lib/features/following/components/sidebar/following-sidebar";
import { LivePreviewSidebar } from "@/lib/features/stream/components/live-preview/sidebar/live-preview-sidebar";
import useStoreSidebar from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import { TooltipModel } from "@/components/tooltip-model";
import { Card, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Item } from "./item";
import "@/style/home.css";

export function Sidebar() {
    const { sidebarState, setSidebarState } = useStoreSidebar();
    console.log(sidebarState);
    const toggleSidebar = () => {
        setSidebarState({ isOpen: !sidebarState.isOpen });
    };

    return (
        <div
            className={cn(
                "h-2/4 w-16 flex-shrink-0 overflow-x-hidden overflow-y-hidden rounded-br-3xl rounded-tr-3xl bg-gradient-to-t from-black-2 via-teal-3 to-teal-2 transition-all duration-300 ease-in-out",
                sidebarState.isOpen && "h-full w-72",
            )}
        >
            {sidebarState.isOpen ? (
                <Card className="w-auto p-4 pr-0">
                    <CardTitle className="mb-2 mr-4 flex flex-row items-center justify-between text-2xl">
                        Sidebar Content
                        <TooltipModel content="Collapse" side="right">
                            <button onClick={toggleSidebar}>
                                <Menu color="#ffffff" strokeWidth={2.25} />
                            </button>
                        </TooltipModel>
                    </CardTitle>
                    <ScrollArea className="h-[calc(100vh-4rem)]">
                        <Item title="Live Previews" link="/">
                            <LivePreviewSidebar />
                        </Item>
                        <Item title="Following" link="/following">
                            <FollowingSidebar />
                        </Item>
                    </ScrollArea>
                </Card>
            ) : (
                <div className="flex flex-col items-center py-3">
                    <TooltipModel content="Expand" side="right">
                        <button onClick={toggleSidebar}>
                            <Menu
                                color="#ffffff"
                                strokeWidth={2.25}
                                className="my-3"
                            />
                        </button>
                    </TooltipModel>
                    <CollapseSidebar />
                </div>
            )}
        </div>
    );
}
