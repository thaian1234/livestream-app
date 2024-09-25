import { LivesPreview } from "@/lib/features/stream/components/live-preview/live-preview";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
    return (
        <ScrollArea className="h-[calc(100vh-5rem)] w-full">
            <div className="mx-auto p-6">
                <p className="mb-6 text-2xl font-bold text-white">
                    Welcome to Your Dashboard
                </p>
                {/* Placeholder content */}
                <div className="grid gap-6 min-[712px]:grid-cols-1 min-[840px]:grid-cols-2 min-[1096px]:grid-cols-3 min-[1352px]:grid-cols-4">
                    <LivesPreview />
                </div>
            </div>
        </ScrollArea>
    );
}
