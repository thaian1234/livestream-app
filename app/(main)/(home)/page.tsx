import { BlockButton } from "@/lib/features/block/components/block-button";
import { FollowButton } from "@/lib/features/follow/components/follow-button";
import { LivesPreview } from "@/lib/features/stream/components/live-preview/live-preview";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
    return (
        <ScrollArea className="h-[calc(100vh-5rem)] w-full">
            <div className="mx-auto px-10 md:max-w-screen-md lg:max-w-screen-xl 2xl:max-w-screen-2xl 2xl:px-4">
                <h2 className="mb-6 text-2xl font-bold text-white">
                    Welcome to Your Dashboard
                </h2>
                <FollowButton followerId="123" followingId="123"></FollowButton>
                <BlockButton blockedId="123" blockerId="123"></BlockButton>
                {/* Placeholder content */}
                <div className="grid gap-6 min-[712px]:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                    <LivesPreview />
                </div>
            </div>
        </ScrollArea>
    );
}
