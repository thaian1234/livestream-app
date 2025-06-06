"use client";

import { useParams, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

import { AboutChannel } from "@/lib/components/livestream-user/about-channel";
import { ROUTES } from "@/lib/configs/routes.config";
import { streamApi } from "@/lib/features/stream/apis";
import { Chat } from "@/lib/features/stream/components/chat";
import { LiveInformation } from "@/lib/features/stream/components/livescreen/live-information";
import { LivestreamPlayer } from "@/lib/features/stream/components/livescreen/livestream-player";
import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { useUser } from "@/lib/hooks/use-user";
import { ChatProvider } from "@/lib/providers/stream-chat-provider";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";
import { ChatStatus, useLiveInfor } from "@/lib/stores/store-live-infor";
import { cn } from "@/lib/utils";

import { LoadingStreamPage } from "@/components/loading-stream-page";

type ParamsType = {
    username: string;
};

export default function StreamPage() {
    const router = useRouter();
    const params = useParams<ParamsType>();
    const currentUser = useUser();
    const { data, isPending, isError } =
        streamApi.query.useGetStreamInformation(params?.username || "");
    const { isOpenChatComponent, isOpenPrivateChat } = useLiveInfor();
    const desktopScreen = useMediaQuery("(min-width: 1280px)");

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
        <section className="grid grid-cols-12 gap-4">
            {/* Desktop Screen */}
            {desktopScreen ? (
                <>
                    <StreamVideoProvider>
                        <div
                            className={cn(
                                "row-span-5 rounded-lg border border-slate-700",
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
                                : "col-span-12 mx-14",
                        )}
                    >
                        <LiveInformation
                            followerCount={followers?.length || 0}
                            stream={stream}
                            user={user}
                            isFollowing={isFollowing}
                            isOwnedStream={currentUser.user.id === user.id}
                        />
                        <AboutChannel user={user} />
                    </div>
                    <div
                        className={cn(
                            isOpenChatComponent &&
                                "col-span-3 col-start-10 row-span-5 row-start-1",
                        )}
                    >
                        <ChatProvider
                            streamId={stream.id}
                            streamerId={
                                isOpenPrivateChat ? stream.userId : undefined
                            }
                        >
                            {isOpenChatComponent && (
                                <Chat
                                    isHost={false}
                                    setting={setting}
                                    isFollowing={isFollowing}
                                    streamerId={stream.userId}
                                />
                            )}
                        </ChatProvider>
                    </div>
                </>
            ) : (
                <div className="col-span-12 space-y-4">
                    {/* Mobile Screen */}
                    <div className="aspect-video">
                        <StreamVideoProvider>
                            <CustomCall streamId={stream.id}>
                                <LivestreamPlayer />
                            </CustomCall>
                        </StreamVideoProvider>
                    </div>
                    <div className="flex w-full flex-col justify-between gap-1 md:flex-row">
                        <div className="w-full">
                            <LiveInformation
                                followerCount={followers?.length || 0}
                                stream={stream}
                                user={user}
                                isFollowing={isFollowing}
                                isOwnedStream={currentUser.user.id === user.id}
                            />
                            <div className="hidden md:block">
                                <AboutChannel user={user} />
                            </div>
                        </div>

                        <div className="min-w-[400px]">
                            <ChatProvider
                                streamId={stream.id}
                                streamerId={
                                    isOpenPrivateChat
                                        ? stream.userId
                                        : undefined
                                }
                            >
                                <Chat
                                    isHost={false}
                                    setting={setting}
                                    isFollowing={isFollowing}
                                    streamerId={stream.userId}
                                />
                            </ChatProvider>
                        </div>
                        <div className="block md:hidden">
                            <AboutChannel user={user} />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
