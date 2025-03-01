"use client";

import { CircleGauge, PauseIcon, PlayIcon, TvMinimal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { VideoThumbnail } from "@/components/thumbnail";

import { FullscreenButton } from "./controls/fullscreen-button";
import { PipButton } from "./controls/pip-button";
import { SpeedControl } from "./controls/speed-control";
import { VolumnControl } from "./controls/volumn-control";

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
const dummyDataVideo: ISelectVideo = {
    videoUrl: "https://www.youtube.com/watch?v=Bg9ov94WMgU",
    thumbnailUrl:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fathuan611%2F%25E1%25BA%25A3nh-169%2F&psig=AOvVaw3n1uhLO7LOMaGooIgZLHx9&ust=1740549122864000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIiBzfKQ3osDFQAAAAAdAAAAABAE",
    viewCount: 142000,
    likeCount: 120,
    dislikeCount: 1,
    userId: "1",
    userName: "John",
    isFollowing: false,
    followers: 100,
    title: "slow days, soft sounds — (music playlist for moments of peace) slow days, soft soundsslow days, soft soundsslow days, soft soundsslow days, soft sounds",
    description:
        "everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life)  ",
    createdAt: "4 months ago",
    duration: "31:19",
    categories: ["Entertainment", "Music"],
};

export function DummyVideoPlayer() {
    const playerRef = useRef<ReactPlayer>(null);
    const playerWrapperRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [isLightMode, setIsLightMode] = useState(true);
    const togglePlay = () => {
        console.log({ playing });
        if (isLightMode) {
            setIsLightMode(false); // Khi nhấn Play, tắt light mode
        }
        setPlaying((prev) => !prev);
    };
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    const [showControls, setShowControls] = useState(false);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const handleMouseMove = () => {
        setShowControls(true);
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current); // Xóa timer cũ nếu có
        }
        hideTimeoutRef.current = setTimeout(() => {
            setShowControls(false); // Ẩn controls sau 5 giây nếu không có di chuyển
        }, 5000);
    };

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
                    url={dummyDataVideo.videoUrl}
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
                    light={
                        isLightMode && (
                            <VideoThumbnail
                                thumbnailUrl={dummyDataVideo.thumbnailUrl}
                            />
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
        </>
    );
}
