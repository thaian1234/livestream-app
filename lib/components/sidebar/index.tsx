"use client";

import { Menu } from "lucide-react";

import { followApi } from "@/lib/features/follow/apis";
import { Following } from "@/lib/features/follow/components/following";
import { Recommended } from "@/lib/features/follow/components/recommended";
import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import { TooltipModel } from "@/components/tooltip-model";
import { Card, CardTitle } from "@/components/ui/card";

import { CollapseSidebar } from "./collapse-sidebar";
import { ItemLayout } from "./item-layout";
import "@/style/home.css";

export function Sidebar() {
    const { isOpen, onCollapse, onExpand } = useSidebar();
    // TODO: Fix this shietttttt
    const { data, isPending } = followApi.query.useFollow();

    if (data === undefined || isPending) {
        return <div>Loading...</div>;
    }
    return (
        <aside
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
                    <ItemLayout title="Following Channel">
                        <Following followings={data.data.followings} />
                    </ItemLayout>
                    <ItemLayout title="Recommended Channel">
                        <Recommended />
                    </ItemLayout>
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
        </aside>
    );
}
