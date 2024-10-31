import { StreamUpdateDialog } from "../../../../components/stream-update-dialog";
import { streamApi } from "../../apis";
import { ToggleLiveButton } from "../controls/toggle-live-button";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Forward, Heart, UsersRound } from "lucide-react";

import { useAuth } from "@/lib/providers/auth-provider";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";

export function LocalLiveInformation() {
    const { isPending, user, stream, isSignedIn } = useAuth();
    const { useParticipants, useIsCallLive } = useCallStateHooks();
    const participants = useParticipants();
    const isHost =
        participants.filter(
            (p, _) => p.userId === user?.id && p.roles.includes("host"),
        ).length > 0;
    const isLive = useIsCallLive();

    if (isPending) {
        return <p>Loading information</p>;
    }
    if (!isSignedIn || !user || !stream) {
        return <p>Error</p>;
    }

    return (
        <section className="mt-2 flex justify-between">
            <AdditionalInformation isLive={isLive} username={user.username} />
            {!isHost ? (
                <div className="flex items-center space-x-4">
                    <Button
                        size="sm"
                        className="rounded-xl bg-teal-2 text-black-0"
                    >
                        <Heart size={20} className="mr-1" />
                        Follow
                    </Button>
                    <Button
                        size="sm"
                        className="ml-2 rounded-xl bg-white/10 text-white"
                    >
                        <Forward className="mr-1" />
                        Share
                    </Button>
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                    <ToggleLiveButton
                        isLive={isLive}
                        username={user.username}
                    />
                    <StreamUpdateDialog username={user.username} />
                </div>
            )}
        </section>
    );
}

interface AdditionalInformationProps {
    isLive: boolean;
    username: string;
}
function AdditionalInformation({
    isLive,
    username,
}: AdditionalInformationProps) {
    const { data, isPending, isError } =
        streamApi.query.useGetStreamInformation(username);

    if (isPending) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <div className="flex space-x-6 text-sm text-white/70">
                    <Skeleton className="h-4 w-10" />
                    <span className="flex space-x-1">
                        <UsersRound size={16} />
                        <Skeleton className="h-4 w-10" />
                    </span>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return <p>Failed to load AdditionalInformation</p>;
    }

    const stream = data.data.stream;
    const user = data.data.user;
    const follwers = data.data.followers;

    return (
        <div className="w-full truncate p-2 text-white">
            <h2 className="text-xl">{stream.name}</h2>
            <div className="flex w-full items-center space-x-4">
                <UserAvatar
                    imageUrl={user.imageUrl}
                    isLive={isLive}
                    size="lg"
                />
                <div className="space-y-1">
                    <p className="text-sm">{username}</p>
                    <div className="flex space-x-6 text-sm text-white/70">
                        <span>Followers: {follwers?.length || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
