import { useEffect, useState } from "react";
import { useChannelStateContext } from "stream-chat-react";

interface Viewer {
    name: string;
    online: boolean;
    id: string;
}

export function useChannelViewers() {
    const { channel } = useChannelStateContext();
    const [channelViewers, setChannelViewers] = useState<Viewer[]>(
        Object.values(channel.state.watchers).map((user) => ({
            name: user.name || "",
            online: !!user.online,
            id: user.id,
        })),
    );

    useEffect(() => {
        const updateChannelViewers = () => {
            const viewers = Object.values(channel.state.watchers).map(
                (user) => ({
                    name: user.name || "",
                    online: !!user.online,
                    id: user.id,
                }),
            );
            setChannelViewers(viewers);
        };

        const checkWatcherCount = async () => {
            if (
                channel.state.watcher_count !==
                Object.keys(channel.state.watchers).length
            ) {
                await channel.query({
                    watchers: {
                        limit: 5,
                    },
                });
            }
        };

        // Event listeners
        channel.on("user.watching.start", updateChannelViewers);
        channel.on("user.watching.stop", updateChannelViewers);

        checkWatcherCount();

        // Cleanup
        return () => {
            channel.off("user.watching.start", updateChannelViewers);
            channel.off("user.watching.stop", updateChannelViewers);
        };
    }, [channel, channel.state.watchers]);
    return { channelViewers };
}
