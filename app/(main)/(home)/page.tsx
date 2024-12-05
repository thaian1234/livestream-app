import React from "react";

import { CategoryList } from "@/lib/features/category/components/category-list";
import { FollowingStream } from "@/lib/features/stream/components/preview/following-stream";
import { RecommendStream } from "@/lib/features/stream/components/preview/recommend-stream";

export default function HomePage() {
    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold text-white">
                Welcome to Your Dashboard
            </h2>
            <RecommendStream />
            {/* <CategoryList /> */}
            <FollowingStream />
        </section>
    );
}
