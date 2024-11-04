"use client";

import { Chat } from "@/lib/features/stream/components/chat";
import { LocalLiveInformation } from "@/lib/features/stream/components/local-livescreen/local-live-information";
import { LocalLivestreamPlayer } from "@/lib/features/stream/components/local-livescreen/local-livestream-player";
import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { useAuth } from "@/lib/providers/auth-provider";
import { ChatProvider } from "@/lib/providers/stream-chat-provider";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";
import { useLiveInfor } from "@/lib/stores/store-live-infor";
import { cn } from "@/lib/utils";

import { LoadingStreamPage } from "@/components/loading-stream-page";

export default function StreamPage() {
    const auth = useAuth();
    const { isOpenChatComponent } = useLiveInfor();

    if (auth.isPending) {
        return <LoadingStreamPage />;
    }
    if (!auth.isSignedIn || !auth.stream) {
        return <p>Error: User is not signed in</p>;
    }

    return (
        <section className="grid grid-cols-12 grid-rows-5 gap-4">
            <div
                className={cn(
                    "row-span-5",
                    isOpenChatComponent ? "col-span-9" : "col-span-12",
                )}
            >
                <StreamVideoProvider>
                    <CustomCall streamId={auth.stream.id}>
                        <div className="aspect-video">
                            <LocalLivestreamPlayer />
                        </div>
                        <LocalLiveInformation />
                    </CustomCall>
                </StreamVideoProvider>
            </div>
            {isOpenChatComponent && (
                <div className="col-span-3 col-start-10 row-span-5">
                    <ChatProvider streamId={auth.stream.id}>
                        <Chat />
                    </ChatProvider>
                </div>
            )}
        </section>
    );
}
