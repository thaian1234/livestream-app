import React from "react";

import { FollowingStream } from "@/lib/features/stream/components/preview/following-stream";
import { RecommendStream } from "@/lib/features/stream/components/preview/recommend-stream";
import { StreamSectionLayout } from "@/lib/features/stream/layouts/stream-section.layout";

export default function HomePage() {
    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold text-white">
                Welcome to Your Dashboard
            </h2>
            <RecommendStream />
            <FollowingStream />
        </section>
    );
}
