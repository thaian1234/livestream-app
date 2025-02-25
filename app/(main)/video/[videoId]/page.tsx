"use client";

import {
    Heart,
    Maximize,
    MoreHorizontal,
    Pause,
    Play,
    Share2,
    ThumbsDown,
    ThumbsUp,
    Volume2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactPlayer from "react-player";

import { PreviewVideoList } from "@/lib/features/video/components/preview-video-list";
import { VideoPlayer } from "@/lib/features/video/components/video-player";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { VideoThumbnail } from "@/components/thumbnail";
import { UserAvatar } from "@/components/user-avatar";

export default function VideoPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    return (
        <div className="mx-10 pt-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <VideoPlayer />
                </div>
                <PreviewVideoList />
            </div>
        </div>
    );
}
