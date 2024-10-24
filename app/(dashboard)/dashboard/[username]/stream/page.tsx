"use client";

import { Chat } from "@/lib/features/stream/components/chat";
import { LocalChat } from "@/lib/features/stream/components/chat/local-chat";
import { LocalLiveInformation } from "@/lib/features/stream/components/local-livescreen/local-live-information";
import { LocalLivestreamPlayer } from "@/lib/features/stream/components/local-livescreen/local-livestream-player";

export default function StreamPage() {
    return (
        <section className="grid grid-cols-12 gap-4 px-5">
            <div className="col-span-9 row-span-5">
                <LocalLivestreamPlayer />
            </div>
            <div className="col-span-3 col-start-10 row-span-5 row-start-1">
                <LocalChat />
            </div>
            <div className="col-span-9 col-start-1 row-span-2">
                <LocalLiveInformation />
            </div>
        </section>
    );
}
