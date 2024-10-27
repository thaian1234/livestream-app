"use client";

import { LocalChat } from "@/lib/features/stream/components/chat/local-chat";
import { LocalLiveInformation } from "@/lib/features/stream/components/local-livescreen/local-live-information";
import { LocalLivestreamPlayer } from "@/lib/features/stream/components/local-livescreen/local-livestream-player";
import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { useAuth } from "@/lib/providers/auth-provider";

export default function StreamPage() {
    const auth = useAuth();
    if (auth.isPending) {
        return <p>Loading...</p>;
    }
    if (!auth.isSignedIn || !auth.stream) {
        return <p>Error: User is not signed in</p>;
    }

    return (
        <section className="grid grid-cols-12 gap-4 px-5">
            <CustomCall streamId={auth.stream.id}>
                <div className="col-span-9 row-span-5">
                    <LocalLivestreamPlayer />
                </div>
                <div className="col-span-9 col-start-1 row-span-2">
                    <LocalLiveInformation />
                </div>
            </CustomCall>
            <div className="col-span-3 col-start-10 row-span-5 row-start-1">
                <LocalChat />
            </div>
        </section>
    );
}
