"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LivesPreview } from "@/lib/features/stream/components/live-preview/live-preview";
import { Chat } from "@/lib/features/stream/components/live/chat";
import { LiveInformation } from "@/lib/features/stream/components/live/live-information";
import { LiveScreen } from "@/lib/features/stream/components/live/live-screen";
import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function LivePage() {
    const { infor } = useLiveInfor();
    const router = useRouter();
    const { liveSrceenStatus } = useLiveInfor();
    const { isChatComponent } = useLiveInfor();

    useEffect(() => {
        if (infor.id === "") {
            router.push("/");
        }
    }, []);
    return (
        <div className="flex w-screen pr-4">
            <ScrollArea className="h-[calc(100vh-5rem)] w-full pl-4 pr-2">
                <LiveScreen />
                {liveSrceenStatus.cinemaMode === false && (
                    <div className="space-y-10">
                        <LiveInformation />
                        <div>
                            <p className="mb-4 text-lg text-white">
                                Recommended
                            </p>
                            <div className="grid gap-6 min-[712px]:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                                <LivesPreview />
                            </div>
                        </div>
                    </div>
                )}
            </ScrollArea>
            {isChatComponent && <Chat />}
        </div>
    );
}
