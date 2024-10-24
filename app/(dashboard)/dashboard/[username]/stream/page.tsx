"use client";

import { Chat } from "@/lib/features/stream/components/chat";
import { LocalLiveInformation } from "@/lib/features/stream/components/local-livescreen/local-live-information";
import { LocalLivestreamPlayer } from "@/lib/features/stream/components/local-livescreen/local-livestream-player";

export default function StreamPage() {
    return (
        <section className="grid grid-cols-12 gap-x-4 gap-y-2 px-5">
            <div className="col-span-9 row-span-5">
                <LocalLivestreamPlayer />
            </div>
            <div className="col-span-3 col-start-10 row-span-5 row-start-1">
                <Chat />
            </div>
            <div className="col-span-9 col-start-1 row-span-2 row-start-9">
                <LocalLiveInformation />
            </div>
        </section>
    );
}
