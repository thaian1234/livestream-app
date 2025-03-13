"use client";

import { Bell } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ROUTES } from "@/lib/configs/routes.config";
import { FollowButton } from "@/lib/features/follow/components/follow-button";
import { streamApi } from "@/lib/features/stream/apis";
import { LivestreamPlayer } from "@/lib/features/stream/components/livescreen/livestream-player";
import { CustomCall } from "@/lib/features/stream/layouts/custom-call";
import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";

import { Button } from "@/components/ui/button";

import { UserAvatar } from "@/components/user-avatar";

import { LoadingStreamAbout } from "./loading-stream-about";

type ParamsType = {
    username: string;
};

export function Infor() {
    const router = useRouter();
    const params = useParams<ParamsType>();
    const { data, isPending, isError } =
        streamApi.query.useGetStreamInformation(params.username);
    if (isPending) {
        return <LoadingStreamAbout />;
    }
    if (!data || isError || data?.data.isBlocked) {
        return router.replace(ROUTES.HOME_PAGE);
    }
    const stream = data.data.stream;
    const user = data.data.user;
    const followers = data.data.followers;
    const setting = data.data.setting;
    const isFollowing = data.data.isFollowing;

    return (
        <div className="relative mx-20 flex flex-col">
            <StreamVideoProvider>
                <div className="aspect-[2/1] max-h-[calc(100vh-7rem)] w-full cursor-pointer rounded-lg border border-slate-700">
                    <CustomCall streamId={stream.id}>
                        <LivestreamPlayer />
                    </CustomCall>
                </div>
            </StreamVideoProvider>
            {/* Channel Info */}
            <div className="bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/50 to-transparent p-4 text-white lg:absolute">
                <div className="flex flex-row gap-4">
                    <div className="flex-shrink-0">
                        <UserAvatar
                            imageUrl={user.imageUrl}
                            isLive={stream.isLive}
                            size="xl"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col justify-between gap-2 md:flex-row">
                            <div>
                                <h1 className="text-lg font-bold xl:text-2xl">
                                    {user.username}
                                </h1>
                                <div className="mt-1 text-xs text-white/50 xl:text-sm">
                                    Followers: {followers?.length || 0} • 449
                                    videos
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FollowButton
                                    followingId={user.id}
                                    isFollowed={isFollowing}
                                />
                                <Button variant="ghost" size="icon">
                                    <Bell />
                                </Button>
                            </div>

                            {/* link social */}
                            {/* <div className="mt-1 text-sm text-blue-600">
                                <Link href="#">
                                    bandina.vn/shop/hoang-yen-chibi-duyet-first-ep
                                </Link>{" "}
                                and 5 more links
                            </div> */}
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs lg:text-sm">
                            {user.bio}
                            {/* <span className="cursor-pointer text-gray-600">
                                    ...more
                                </span> */}
                        </p>
                        <Button
                            variant="link"
                            className="m-0n px-2 text-xs text-gray-400 lg:text-sm"
                            // onClick={() => setIsShowMore(!isShowMore)}
                        >
                            {/* {isShowMore ? "Show less" : "Show more"} */}
                            Show more
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
