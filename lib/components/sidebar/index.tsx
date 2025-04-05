"use client";

import "@/style/home.css";
import { Menu } from "lucide-react";

import { followApi } from "@/lib/features/follow/apis";
import { Following } from "@/lib/features/follow/components/following";
import { Recommend } from "@/lib/features/follow/components/recommended";
import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { TooltipModel } from "@/components/tooltip-model";

import { CollapseSidebar } from "./collapse-sidebar";
import { ItemLayout } from "./item-layout";

export function Sidebar() {
    const { isOpenSidebar, onCollapseSidebar, onExpandSidebar, isHideSidebar } =
        useSidebar();
    const { data, isPending, error } = followApi.query.useFollow();
    if (isPending) {
        return <SidebarSkeleton />;
    }
    if (error || !data) {
        return <p>Some thing went wrong</p>;
    }
    const following = data?.data.followings ?? [];
    const recommends = data?.data.recommends ?? [];

    return (
        <>
            {!isHideSidebar && (
                <div
                    className={cn(
                        "fixed left-0 top-20 z-20 w-16 flex-shrink-0 overflow-x-hidden overflow-y-hidden rounded-br-3xl rounded-tr-3xl bg-gradient-to-t from-black-2/90 via-teal-3/95 to-teal-2 transition-all duration-300 ease-in-out",
                        isOpenSidebar && "h-[calc(100vh-5rem)] w-72",
                    )}
                >
                    {isOpenSidebar ? (
                        <Card className="w-auto divide-y divide-white/40 p-4">
                            <CardTitle className="flex flex-row items-center justify-between text-xl font-bold">
                                Channels
                                <TooltipModel content="Collapse" side="right">
                                    <Button
                                        onClick={onExpandSidebar}
                                        className="rounded-full bg-transparent p-2 transition-colors hover:bg-white/10"
                                    >
                                        <Menu
                                            color="#ffffff"
                                            strokeWidth={2.25}
                                        />
                                    </Button>
                                </TooltipModel>
                            </CardTitle>
                            <ItemLayout title="Following Channel" link="/home">
                                {following && (
                                    <Following followings={following} />
                                )}
                            </ItemLayout>
                            <ItemLayout title="Recommended Channel" link="/">
                                {recommends && (
                                    <Recommend recommends={recommends} />
                                )}
                            </ItemLayout>
                        </Card>
                    ) : (
                        <div className="flex flex-col items-center space-y-2 py-3">
                            <TooltipModel content="Expand" side="right">
                                <Button
                                    onClick={onCollapseSidebar}
                                    className="rounded-full bg-transparent p-2 transition-colors hover:bg-white/10"
                                >
                                    <Menu
                                        color="#ffffff"
                                        strokeWidth={2.25}
                                        className="my-2"
                                    />
                                </Button>
                            </TooltipModel>
                            <CollapseSidebar
                                users={[...recommends, ...following]}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export function SidebarSkeleton() {
    const { isOpenSidebar } = useSidebar();

    return (
        <div>
            <Skeleton
                className={cn(
                    "h-2/4 w-16 flex-shrink-0 overflow-x-hidden overflow-y-hidden rounded-br-3xl rounded-tr-3xl bg-gradient-to-t from-black-2 via-teal-3 to-teal-2 transition-all duration-700 ease-in-out",
                    isOpenSidebar && "h-full w-72",
                )}
            />
        </div>
    );
}
