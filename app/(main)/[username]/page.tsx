"use client";

import { useParams, useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { streamApi } from "@/lib/features/stream/apis";
import { Chat } from "@/lib/features/stream/components/chat";
import { LiveInformation } from "@/lib/features/stream/components/livescreen/live-information";
import { LivestreamPlayer } from "@/lib/features/stream/components/livescreen/livestream-player";
import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { ChatProvider } from "@/lib/providers/stream-chat-provider";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";
import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { cn } from "@/lib/utils";

import { LoadingStreamPage } from "@/components/loading-stream-page";
import { useUser } from "@/lib/hooks/use-user";

type ParamsType = {
    username: string;
};

export default function StreamPage() {
    const router = useRouter();
    const params = useParams<ParamsType>();
    const currentUser = useUser();
    const { data, isPending, isError } =
        streamApi.query.useGetStreamInformation(params.username);
    const { isOpenChatComponent } = useLiveInfor();

    if (isPending) {
        return <LoadingStreamPage />;
    }
    if (!data || isError || data?.data.isBlocked) {
        return router.replace(ROUTES.HOME_PAGE);
    }

    const stream = data.data.stream;
    const user = data.data.user;
    const followers = data.data.followers;
    const setting = data.data.setting;
    const isFollowing = data.data.isFollowing;

    return (
        <section className="grid grid-cols-12 grid-rows-5 gap-4">
            <StreamVideoProvider>
                <div
                    className={cn(
                        "row-span-5",
                        isOpenChatComponent
                            ? "col-span-9"
                            : "col-span-12 mx-14 aspect-[2/1]",
                    )}
                >
                    <CustomCall streamId={stream.id}>
                        <LivestreamPlayer />
                    </CustomCall>
                </div>
            </StreamVideoProvider>
            <div
                className={cn(
                    isOpenChatComponent
                        ? "col-span-9"
                        : "col-span-12 mx-14 aspect-[2/1]",
                )}
            >
                <LiveInformation
                    followerCount={followers?.length || 0}
                    stream={stream}
                    user={user}
                    isFollowing={isFollowing}
                    isOwnedStream={currentUser.user.id === user.id}
                />
            </div>
            <div
                className={cn(
                    isOpenChatComponent &&
                        "col-span-3 col-start-10 row-span-5 row-start-1",
                )}
            >
                <ChatProvider streamId={stream.id}>
                    {isOpenChatComponent && (
                        <Chat
                            isHost={false}
                            setting={setting}
                            isFollowing={isFollowing}
                        />
                    )}
                </ChatProvider>
            </div>
        </section>
    );
}
