"use client";

import { Menu } from "lucide-react";

import { followApi } from "@/lib/features/follow/apis";
import { Following } from "@/lib/features/follow/components/following";
import { Recommend } from "@/lib/features/follow/components/recommended";
import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import { TooltipModel } from "@/components/tooltip-model";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { CollapseSidebar } from "./collapse-sidebar";
import { ItemLayout } from "./item-layout";
import "@/style/home.css";

export function Sidebar() {
    const { isOpen, onCollapse, onExpand } = useSidebar();
    const { data, isPending, error } = followApi.query.useFollow();
    if (data === undefined || isPending) {
        return <SidebarSkeleton />;
    }
    if (error) {
        return <p>Some thing went wrong</p>;
    }
    const following = data?.data.followings;
    const recommends = data?.data.recommends;

    return (
        <div
            className={cn(
                "h-2/4 w-16 flex-shrink-0 overflow-x-hidden overflow-y-hidden rounded-br-3xl rounded-tr-3xl bg-gradient-to-t from-black-2 via-teal-3 to-teal-2 transition-all duration-300 ease-in-out",
                isOpen && "h-full w-72",
            )}
        >
            {isOpen ? (
                <Card className="w-auto p-4 pr-0">
                    <CardTitle className="mb-2 mr-4 flex flex-row items-center justify-between text-xl">
                        Channels
                        <TooltipModel content="Collapse" side="right">
                            <button onClick={onExpand}>
                                <Menu color="#ffffff" strokeWidth={2.25} />
                            </button>
                        </TooltipModel>
                    </CardTitle>
                    {following && (
                        <ItemLayout title="Following Channel" link="/home">
                            <Following followings={following} />
                        </ItemLayout>
                    )}
                    {recommends && (
                        <ItemLayout title="Recommended Channel" link="/">
                            <Recommend recommends={recommends} />
                        </ItemLayout>
                    )}
                </Card>
            ) : (
                <div className="flex flex-col items-center py-3">
                    <TooltipModel content="Expand" side="right">
                        <button onClick={onCollapse}>
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

export function SidebarSkeleton() {
    const { isOpen } = useSidebar();

    return (
        <div>
            <Skeleton
                className={cn(
                    "h-2/4 w-16 flex-shrink-0 overflow-x-hidden overflow-y-hidden rounded-br-3xl rounded-tr-3xl bg-gradient-to-t from-black-2 via-teal-3 to-teal-2 transition-all duration-700 ease-in-out",
                    isOpen && "h-full w-72",
                )}
            />
        </div>
    );
}
