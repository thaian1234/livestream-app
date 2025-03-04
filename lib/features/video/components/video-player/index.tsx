"use client";

import { PauseIcon, PlayIcon, TvMinimal } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { formatTime } from "@/lib/helpers/formatData";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { VideoThumbnail } from "@/components/thumbnail";

import { videoApi } from "../../apis";
import { FullscreenButton } from "./controls/fullscreen-button";
import { PipButton } from "./controls/pip-button";
import { SpeedControl } from "./controls/speed-control";
import { VolumnControl } from "./controls/volumn-control";
import { VideoInfor } from "./video-infor";
import { VideoPlayerSkeleton } from "./video-player-skeleton";

export interface ISelectVideo {
    title: string;
    userId: string;
    userName: string;
    videoUrl: string;
    thumbnailUrl: string;
    likeCount: number;
    dislikeCount: number;
    viewCount: number;
    isFollowing: boolean;
    followers: number;
    description: string;
    createdAt: string;
    duration: string;
    categories: string[];
}

type ParamsType = {
    videoId: string;
};

export function VideoPlayer() {
    const [hasCounted, setHasCounted] = useState(false);
    const { videoId } = useParams<ParamsType>();
    const { data, isPending, error } = videoApi.query.useGetVideo(videoId);
    const {
        mutate: updateViewCount,
        isPending: pendingViewCount,
        error: pendingError,
    } = videoApi.mutation.useUpdateVideo();

    const playerRef = useRef<ReactPlayer>(null);
    const playerWrapperRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [playing, setPlaying] = useState(false);
    const [isLightMode, setIsLightMode] = useState(true);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
        if (isLightMode) {
            setIsLightMode(false); // Khi nhấn Play, tắt light mode
        }
        setPlaying((prev) => !prev);
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current); // Xóa timer cũ nếu có
        }
        hideTimeoutRef.current = setTimeout(() => {
            setShowControls(false); // Ẩn controls sau 5 giây nếu không có di chuyển
        }, 5000);
    };

    useEffect(() => {
        if (!hasCounted && data && videoId) {
            updateViewCount({
                param: {
                    id: videoId,
                },
                json: {
                    viewCount: data.data.viewCount + 1,
                },
            });
            setHasCounted(true);
        }
    }, [data, hasCounted, updateViewCount, videoId]);
    if (!!error) {
        redirect("/");
    }

    if (!data || isPending) {
        return <VideoPlayerSkeleton />;
    }
    const video = data.data;
    return (
        <>
            {/* Video Player */}
            <div
                className="relative aspect-video overflow-hidden rounded-lg bg-gray-900"
                ref={playerWrapperRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                    setShowControls(false);
                    if (hideTimeoutRef.current) {
                        clearTimeout(hideTimeoutRef.current);
                    }
                }}
                onClick={togglePlay}
            >
                <ReactPlayer
                    className="pointer-events-none"
                    ref={playerRef}
                    url={video.videoUrl}
                    controls={false} // Hiển thị các nút điều khiển
                    playing={playing}
                    muted={muted}
                    volume={volume}
                    width="100%"
                    height="100%"
                    progressInterval={500}
                    onProgress={({ played }) => setPlayed(played)}
                    onEnded={() => setPlaying(false)}
                    playbackRate={playbackRate}
                    stopOnUnmount={false}
                    onDuration={(d) => setDuration(d)}
                    light={
                        isLightMode && (
                            <VideoThumbnail thumbnailUrl={video.thumbnailUrl} />
                        )
                    }
                />
                {showControls && (
                    <div onClick={(e) => e.stopPropagation()}>
                        {/* progress */}
                        <Slider
                            value={[played * 100]}
                            onValueChange={(value) => {
                                if (playerRef.current) {
                                    playerRef.current.seekTo(
                                        value[0] / 100,
                                        "fraction",
                                    );
                                    setPlayed(value[0] / 100);
                                }
                            }}
                            max={100}
                            step={0.1}
                            className="absolute inset-x-0 bottom-16 flex h-0.5 w-full cursor-pointer items-center justify-between"
                        />
                        <article className="absolute inset-x-0 bottom-0 flex h-16 items-center justify-between bg-gradient-to-t from-black-0/90 to-transparent p-4">
                            <div className="flex">
                                {/* play button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation;
                                        togglePlay();
                                    }}
                                >
                                    {playing ? (
                                        <PauseIcon fill="white" />
                                    ) : (
                                        <PlayIcon fill="white" />
                                    )}
                                </button>

                                {/* column control */}
                                <VolumnControl
                                    volume={volume}
                                    setVolume={setVolume}
                                    muted={muted}
                                    setMuted={setMuted}
                                />
                            </div>
                            <div className="flex items-center">
                                <div>
                                    {formatTime(played * duration)} /
                                    {formatTime(duration)}
                                </div>
                                {/* Playback Speed */}
                                <SpeedControl
                                    playbackRate={playbackRate}
                                    setPlaybackRate={setPlaybackRate}
                                />
                                {/* <VideoQualitySelector /> */}

                                {/* <PiPButton /> không áp dụng được cho video youtube */}
                                <PipButton playerRef={playerRef} />

                                {/* <CinemaModeButton /> */}
                                <Button
                                    className="bg-transparent text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <TvMinimal strokeWidth={3} />
                                </Button>

                                {/* Fullscreen */}
                                <FullscreenButton
                                    playerWrapperRef={playerWrapperRef}
                                />
                            </div>
                        </article>
                    </div>
                )}
            </div>
            {/* Video Info */}
            <VideoInfor videoData={video} />
        </>
    );
}
