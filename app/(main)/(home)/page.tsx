import React from "react";

import { CategoryList } from "@/lib/features/category/components/category-list";
import { FollowingStream } from "@/lib/features/stream/components/preview/following-stream";
import { RecommendStream } from "@/lib/features/stream/components/preview/recommend-stream";

export default function HomePage() {
    return (
        <section>
            <div className="mb-8">
                <RecommendStream />
            </div>
            {/* <CategoryList /> */}
            <FollowingStream />
        </section>
    );
}
