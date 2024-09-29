import { BlockButton } from "@/lib/features/block/components/block-button";
import { FollowButton } from "@/lib/features/follow/components/follow-button";
import { LivesPreview } from "@/lib/features/stream/components/live-preview";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
    return (
        <ScrollArea className="h-[calc(100vh-5rem)] w-full">
            <div className="mx-auto p-6">
                <p className="mb-6 text-2xl font-bold text-white">
                    Welcome to Your Dashboard
                </p>
                <FollowButton></FollowButton>
                <BlockButton></BlockButton>
                {/* Placeholder content */}
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <LivesPreview />
                </div>
            </div>
        </ScrollArea>
    );
}
