"use client";

import {
    ParticipantView,
    StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LivePreviewCarousel } from "@/lib/features/stream/components/live-preview/live-preview-carousel";
import { Chat } from "@/lib/features/stream/components/live/chat";
import { LiveInformation } from "@/lib/features/stream/components/live/live-information";
import { LiveScreen } from "@/lib/features/stream/components/live/live-screen";
import { LoadingParticipant } from "@/lib/features/stream/components/live/live-screen/loading-participant";
import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { useSidebar } from "@/lib/stores/store-sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function LivePage() {
    const router = useRouter();
    const { infor, liveSrceenStatus, resetLiveScreenStatus, isChatComponent } =
        useLiveInfor();
    const { onShowSidebar } = useSidebar();

    useEffect(() => {
        if (infor.id === "") {
            router.push("/");
        }
        resetLiveScreenStatus();
        onShowSidebar();
    }, []);

    // Assuming you have a way to retrieve the participant object
    const [participant, setParticipant] =
        useState<StreamVideoParticipant | null>(null);

    // Example: Fetch or set the participant from your video context or API
    // setParticipant(yourParticipantData);

    return (
        <div className="flex w-screen space-x-4 px-4">
            <ScrollArea className="h-[calc(100vh-5rem)] w-full pl-4 pr-2">
                {!participant ? (
                    <LiveScreen />
                ) : (
                    <ParticipantView
                        participant={participant}
                        ParticipantViewUI={<LiveScreen />}
                    />
                )}

                {!liveSrceenStatus.cinemaMode && (
                    <div className="space-y-10">
                        <LiveInformation />
                        <div className="">
                            <p className="mb-4 text-lg text-white">
                                Recommended
                            </p>
                            <div className="flex w-full justify-center">
                                <LivePreviewCarousel />
                            </div>
                        </div>
                    </div>
                )}
            </ScrollArea>
            {isChatComponent && <Chat />}
            {/* {liveSrceenStatus.miniPlayer && <Miniplayer />} */}
        </div>
    );
}
