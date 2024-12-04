"use client";

import {
    ParticipantView,
    StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { ROUTES } from "@/lib/configs/routes.config";
import { streamApi } from "@/lib/features/stream/apis";
import { Chat } from "@/lib/features/stream/components/chat";
import { LiveScreen } from "@/lib/features/stream/components/livescreen";
import { LiveInformation } from "@/lib/features/stream/components/livescreen/live-information";
import { useLiveInfor } from "@/lib/stores/store-live-infor";

import { ScrollArea } from "@/components/ui/scroll-area";

type ParamsType = {
    username: string;
};

export default function LivePage() {
    const [participant, setParticipant] =
        useState<StreamVideoParticipant | null>(null);
    // Assuming you have a way to retrieve the participant object

    // Example: Fetch or set the participant from your video context or API
    // setParticipant(yourParticipantData);

    const { liveSrceenStatus, isOpenChatComponent } = useLiveInfor();
    const router = useRouter();
    const params = useParams<ParamsType>();
    const { data, isPending, isError } =
        streamApi.query.useGetStreamInformation(params.username);
    if (isPending) {
        return <p>Loading...</p>;
    }
    
    if (!data || isError || data?.data.isBlocked) {
        return router.replace(ROUTES.HOME_PAGE);
    }

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
                        <LiveInformation
                            followerCount={data.data.followers?.length || 0}
                            stream={data.data.stream}
                            user={data.data.user}
                            isFollowing={data.data.isFollowing}
                            isOwnedStream={true}
                        />
                        <div className="">
                            <p className="mb-4 text-lg text-white">
                                Recommended
                            </p>
                            <div className="flex w-full justify-center">
                                {/* <LivePreviewCarousel /> */}
                            </div>
                        </div>
                    </div>
                )}
            </ScrollArea>
            {isOpenChatComponent && <Chat />}
        </div>
    );
}
