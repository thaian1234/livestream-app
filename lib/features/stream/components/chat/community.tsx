"use client";

import { streamApi } from "../../apis";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Event } from "stream-chat";
import { useChannelStateContext, useChatContext } from "stream-chat-react";

import { ROUTES } from "@/lib/configs/routes.config";
import { ChatStatus, useLiveInfor } from "@/lib/stores/store-live-infor";

import { CollapsibleSection } from "@/components/collapsible-section";
import { IconInput, LeftIcon } from "@/components/icon-input";

type ParamsType = {
    username: string;
};

export function Community() {
    const [isOpenBroadcaster, setIsOpenBroadcaster] = useState(true);
    const [isOpenModerators, setIsOpenModerators] = useState(true);
    const [isOpenCommunityVIPs, setIsOpenCommunityVIPs] = useState(true);
    const { onChangeChatStatus, chatStatus } = useLiveInfor();
    const [channelUsers, setChannelUsers] = useState<
        Array<{ name: string; online: boolean; id: string }>
    >([]);
    const { channel, watcher_count } = useChannelStateContext();
    const router = useRouter();
    const params = useParams<ParamsType>();
    const {
        data: streamer,
        isPending,
        isError,
    } = streamApi.query.useGetStreamInformation(params.username);
    useEffect(() => {
        const updateChannelUsers = (event?: Event) => {
            console.log("Call");
            setChannelUsers(
                Object.values(channel.state.watchers).map((user) => ({
                    name: user.name!,
                    online: !!user.online,
                    id: user.id,
                })),
            );
        };
        channel.on("user.watching.start", updateChannelUsers);
        channel.on("user.watching.stop", updateChannelUsers);
        updateChannelUsers();
        return () => {
            channel.on("user.watching.start", updateChannelUsers);
            channel.on("user.watching.stop", updateChannelUsers);
        };
    }, [channel]);
    if (isPending) {
        return <p>Loading...</p>;
    }
    if (!streamer || isError || streamer?.data.isBlocked) {
        return router.replace(ROUTES.HOME_PAGE);
    }
    return (
        <>
            <div className="mx-1 my-2">
                <IconInput
                    placeholder="Filter"
                    variant="primary"
                    customSize="sm"
                    className="border-gray-500 bg-transparent pl-12"
                >
                    <LeftIcon>
                        <Search className="size-5 text-gray-500" />
                    </LeftIcon>
                </IconInput>
            </div>

            <CollapsibleSection
                isOpen={isOpenBroadcaster}
                setIsOpen={setIsOpenBroadcaster}
                title={"Broadcaster"}
            >
                <div
                    key={streamer.data.user.id}
                    className="flex items-center py-1"
                >
                    <p>{streamer.data.user.username}</p>
                </div>
            </CollapsibleSection>
            {/* <CollapsibleSection
                isOpen={isOpenModerators}
                setIsOpen={setIsOpenModerators}
                title={"Moderators"}
            >
                {moderatorsData.map((data) => (
                    <div key={data.id} className="flex items-center py-1">
                        <p>{data.username}</p>
                    </div>
                ))}
            </CollapsibleSection> */}
            <CollapsibleSection
                isOpen={isOpenCommunityVIPs}
                setIsOpen={setIsOpenCommunityVIPs}
                title={"Viewer"}
            >
                {channelUsers.map(
                    (data) =>
                        data.id !== streamer.data.user.id &&
                        data.online && (
                            <div
                                key={data.id}
                                className="flex items-center py-1"
                            >
                                <p>{data.name}</p>
                            </div>
                        ),
                )}
            </CollapsibleSection>
        </>
    );
}
