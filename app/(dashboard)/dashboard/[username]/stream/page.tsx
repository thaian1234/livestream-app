"use client";

import { CallStats } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { settingApi } from "@/lib/features/setting/apis";
import { Chat } from "@/lib/features/stream/components/chat";
import { LocalLiveInformation } from "@/lib/features/stream/components/local-livescreen/local-live-information";
import { LocalLivestreamPlayer } from "@/lib/features/stream/components/local-livescreen/local-livestream-player";
import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { useAuth } from "@/lib/providers/auth-provider";
import { ChatProvider } from "@/lib/providers/stream-chat-provider";
import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { useViewerId } from "@/lib/stores/store-viewer-id-chat";
import { cn } from "@/lib/utils";

import { Spinner } from "@/components/ui/spinner";

import { LoadingStreamPage } from "@/components/loading-stream-page";

export default function StreamPage() {
    const auth = useAuth();
    const { data: setting, isPending: isPendingSetting } =
        settingApi.query.useGetSetting();
    const { isOpenChatComponent } = useLiveInfor();
    const { viewerId } = useViewerId();
    const desktopScreen = useMediaQuery("(min-width: 1280px)");

    if (auth.isPending || isPendingSetting) {
        return <LoadingStreamPage />;
    }
    if (!auth.isSignedIn || !auth.stream || !setting || !auth.user) {
        return <p>Error: User is not signed in</p>;
    }

    return (
        <section className="grid grid-cols-12 gap-4">
            <CustomCall streamId={auth.stream.id}>
                {desktopScreen ? (
                    <div
                        className={cn(
                            "row-span-5",
                            isOpenChatComponent
                                ? "col-span-9 aspect-video"
                                : "col-span-12 mx-6 aspect-[2/1]",
                        )}
                    >
                        <LocalLivestreamPlayer />
                        <LocalLiveInformation />
                        <CallStats
                            LatencyChartSuspenseFallback={
                                <Spinner size="large" />
                            }
                        />
                    </div>
                ) : (
                    <div className="col-span-12 space-y-4">
                        <div className="aspect-video">
                            <LocalLivestreamPlayer />
                        </div>
                        <div className="flex w-full flex-col justify-between gap-2 md:grid md:grid-cols-5">
                            <div className="flex w-full flex-1 flex-col md:col-span-3">
                                <LocalLiveInformation />
                                <div className="hidden flex-1 md:block">
                                    <CallStats
                                        LatencyChartSuspenseFallback={
                                            <Spinner size="large" />
                                        }
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <ChatProvider
                                    streamId={auth.stream.id}
                                    viewerId={viewerId}
                                >
                                    <Chat
                                        setting={setting.data.setting}
                                        isHost={true}
                                        streamerId={auth.user.id}
                                    />
                                </ChatProvider>
                            </div>
                            <div className="block md:hidden">
                                <CallStats
                                    LatencyChartSuspenseFallback={
                                        <Spinner size="large" />
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </CustomCall>
            {desktopScreen && (
                <div className="col-span-3 col-start-10">
                    <ChatProvider streamId={auth.stream.id} viewerId={viewerId}>
                        {isOpenChatComponent && (
                            <Chat
                                setting={setting.data.setting}
                                isHost={true}
                                streamerId={auth.user.id}
                            />
                        )}
                    </ChatProvider>
                </div>
            )}
        </section>
    );
}
