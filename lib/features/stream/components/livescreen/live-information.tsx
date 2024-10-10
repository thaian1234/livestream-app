import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Forward, Heart, UsersRound } from "lucide-react";

import { useAuth } from "@/lib/providers/auth-provider";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

export function LiveInformation() {
    const { isPending, user, stream, isSignedIn } = useAuth();
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    if (isPending) {
        return <p>Loading information</p>;
    }
    if (!isSignedIn || !user || !stream) {
        return <p>Error</p>;
    }

    return (
        <section className="mt-2 flex justify-between">
            <div className="w-full space-y-1 truncate text-white">
                <h2 className="text-xl">{stream.name}</h2>
                <div className="flex w-full items-center space-x-4 p-3">
                    <UserAvatar
                        imageUrl={user.imageUrl}
                        isLive={stream.isLive}
                        size={"lg"}
                    />
                    <div className="space-y-1">
                        <p className="text-sm">{user.username}</p>
                        <div className="flex space-x-6 text-sm text-white/70">
                            <span> Followers: {5}</span>
                            <span className="flex space-x-1">
                                <UsersRound size={16} />
                                <span className="text-sm">
                                    {participants.length}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Button size="sm" className="rounded-xl bg-teal-2 text-black-0">
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
        </section>
    );
}
