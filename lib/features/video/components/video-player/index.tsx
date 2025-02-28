"use client";

import {
    MaximizeIcon,
    MinimizeIcon,
    PauseIcon,
    PlayIcon,
    Volume,
    Volume1,
    Volume2,
    VolumeOff,
} from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { VideoThumbnail } from "@/components/thumbnail";
import { TooltipModel } from "@/components/tooltip-model";

import { videoApi } from "../../apis";
import { VideoInfor } from "./video-infor";

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
//userName, isFollowing, followers, categoriests
// const dummyDataVideo: ISelectVideo = {
//     videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//     thumbnailUrl:
//         "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fathuan611%2F%25E1%25BA%25A3nh-169%2F&psig=AOvVaw3n1uhLO7LOMaGooIgZLHx9&ust=1740549122864000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIiBzfKQ3osDFQAAAAAdAAAAABAE",
//     viewCount: 142000,
//     likeCount: 120,
//     dislikeCount: 1,
//     userId: "1",
//     userName: "John",
//     isFollowing: false,
//     followers: 100,
//     title: "slow days, soft sounds — (music playlist for moments of peace) slow days, soft soundsslow days, soft soundsslow days, soft soundsslow days, soft sounds",
//     description:
//         "everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life) everything you need is already inside you — (a playlist for a quiet life)  ",
//     createdAt: "4 months ago",
//     duration: "31:19",
//     categories: ["Entertainment", "Music"],
// };
type ParamsType = {
    videoId: string;
};
export function VideoPlayer() {
    const { videoId } = useParams<ParamsType>();
    const { data, isPending, error } = videoApi.query.useGetVideo(videoId);
    const {
        mutate: updateViewCount,
        isPending: pendingViewCount,
        error: pendingError,
    } = videoApi.mutation.useUpdateVideo();
    const playerRef = useRef<ReactPlayer>(null);
    const playerWrapperRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [isLightMode, setIsLightMode] = useState(true);
    const [hasCounted, setHasCounted] = useState(false);
    const togglePlay = () => {
        if (isLightMode) {
            setIsLightMode(false); // Khi nhấn Play, tắt light mode
        }
        setPlaying((prev) => !prev);
    };
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const toggleMute = () => setMuted((prev) => !prev);
    const [isVolumeHovered, setIsVolumeHovered] = useState(false);
    const [played, setPlayed] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (playerWrapperRef.current?.requestFullscreen) {
                playerWrapperRef.current.requestFullscreen();
            }
            setFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setFullscreen(false);
        }
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
        return null;
    }
    const video = data.data;
    return (
        <>
            {/* Video Player */}
            <div
                className="relative aspect-video overflow-hidden rounded-lg bg-gray-900"
                ref={playerWrapperRef}
            >
                <ReactPlayer
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
                    light={
                        isLightMode && (
                            <VideoThumbnail thumbnailUrl={video.thumbnailUrl} />
                        )
                    }
                />
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
                    className="absolute inset-x-0 bottom-16 flex h-0.5 w-full items-center justify-between"
                />
                <article className="absolute inset-x-0 bottom-0 flex h-16 items-center justify-between bg-gradient-to-t from-black-0/90 to-transparent p-4">
                    <div className="flex">
                        {/* play button */}
                        <button onClick={togglePlay}>
                            {playing ? (
                                <PauseIcon fill="white" />
                            ) : (
                                <PlayIcon fill="white" />
                            )}
                        </button>
                        {/* column control */}
                        <span
                            className="relative flex items-center"
                            onMouseEnter={() => setIsVolumeHovered(true)}
                            onMouseLeave={() => setIsVolumeHovered(false)}
                        >
                            <TooltipModel
                                content={muted ? "Unmute" : "Mute"}
                                side="bottom"
                            >
                                <Button
                                    onClick={toggleMute}
                                    className="bg-black rounded-full bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-75"
                                >
                                    {muted && <VolumeOff fill="white" />}
                                    {volume === 0 && !muted && (
                                        <Volume fill="white" />
                                    )}
                                    {volume < 0.5 && volume > 0 && !muted && (
                                        <Volume1 fill="white" />
                                    )}
                                    {volume >= 0.5 && !muted && (
                                        <Volume2 fill="white" />
                                    )}
                                </Button>
                            </TooltipModel>
                            {isVolumeHovered && (
                                <div className="bg-black absolute left-10 w-40 transform rounded-md bg-opacity-50 p-2">
                                    <Slider
                                        value={[volume * 100]}
                                        onValueChange={(val) =>
                                            setVolume(val[0] / 100)
                                        }
                                        max={100}
                                        step={1}
                                        className="h-1 w-full"
                                    />
                                </div>
                            )}
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        {/* <VideoQualitySelector />
                        <PiPButton />
                        <CinemaModeButton />
                        <ToggleFullScreenButton /> */}

                        {/* Fullscreen */}
                        <TooltipModel
                            content={
                                fullscreen ? "Exit full screen" : "Full screen"
                            }
                            side="bottom"
                        >
                            <Button
                                onClick={toggleFullscreen}
                                className="bg-black rounded-full text-white transition-all hover:bg-white/30"
                            >
                                {fullscreen ? (
                                    <MinimizeIcon strokeWidth={3} />
                                ) : (
                                    <MaximizeIcon strokeWidth={3} />
                                )}
                            </Button>
                        </TooltipModel>
                    </div>
                </article>
            </div>
            {/* Video Info */}
            <VideoInfor videoData={video} />
        </>
    );
}
