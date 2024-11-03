"use client";

import { useParams, useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { streamApi } from "@/lib/features/stream/apis";
import { Chat } from "@/lib/features/stream/components/chat";
import { LiveInformation } from "@/lib/features/stream/components/livescreen/live-information";
import { LivestreamPlayer } from "@/lib/features/stream/components/livescreen/livestream-player";
import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { ChatProvider } from "@/lib/providers/stream-chat-provider";

type ParamsType = {
    username: string;
};

export default function StreamPage() {
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

    const stream = data.data.stream;
    const user = data.data.user;
    const followers = data.data.followers;

    return (
        <section className="grid grid-cols-12 gap-x-6 gap-y-4">
            <div className="col-span-9 row-span-5">
                <CustomCall streamId={stream.id}>
                    <LivestreamPlayer />
                </CustomCall>
            </div>
            <div className="col-span-3 col-start-10 row-span-5 row-start-1">
                <ChatProvider streamId={stream.id}>
                    <Chat />
                </ChatProvider>
            </div>
            <div className="col-span-9 col-start-1 row-span-2">
                <LiveInformation
                    followerCount={followers?.length || 0}
                    stream={stream}
                    user={user}
                    isFollowing={data.data.isFollowing}
                />
            </div>
        </section>
    );
}
