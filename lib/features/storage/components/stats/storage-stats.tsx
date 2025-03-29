import { Clock, HardDrive, Video } from "lucide-react";

import { formatFileSize } from "@/lib/helpers/formatFileSize";

import { IStorage } from "../../types/storage";
import { StatsCard } from "./stats-card";

interface StorageStatsProps {
    data: IStorage[];
}

export function StorageStats({ data }: StorageStatsProps) {
    // Tính toán các thống kê
    const totalVideos = data.length;
    const totalDuration = data.reduce((acc, video) => acc + video.duration, 0);
    const totalSize = data.reduce((acc, video) => acc + video.fileSize, 0);
    const averageDuration = Math.round(totalDuration / totalVideos);

    // Format thời gian
    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="grid gap-6 rounded-lg border sm:grid-cols-2 lg:grid-cols-4">
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
                title="Total Storage"
                value={formatFileSize(totalSize)}
                icon={HardDrive}
            />
        </div>
    );
}
