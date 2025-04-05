import { Clock, Video } from "lucide-react";

import { storageApi } from "../../apis";
import { StatsCard } from "./stats-card";

export function StorageStats() {
    const { data, isPending, isError } = storageApi.query.useGetStorageStats();
    if (isPending || !data) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Failed to get Stats</div>;
    }
    const { totalVideos, totalDuration, averageDuration, readyVideosCount } =
        data.data;
    // Format thời gian
    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="grid gap-6 rounded-lg border md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Videos" value={totalVideos} icon={Video} />
            <StatsCard
                title="Total Duration"
                value={formatDuration(totalDuration)}
                icon={Clock}
            />
            <StatsCard
                title="Average Duration"
                value={formatDuration(averageDuration)}
                icon={Clock}
            />
            <StatsCard
                title="Total Ready Videos"
                value={readyVideosCount}
                icon={Clock}
            />
        </div>
    );
}
