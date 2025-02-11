import { useEffect, useState } from "react";
import { useChannelStateContext } from "stream-chat-react";

interface Viewer {
    name: string;
    online: boolean;
    id: string;
}

export function useChannelViewers() {
    const { channel } = useChannelStateContext();
    const [channelViewers, setChannelViewers] = useState<Viewer[]>([]);

    useEffect(() => {
        if (!channel) return;

        const updateChannelViewers = async () => {
            try {
                const watchers = await channel.query({
                    watchers: {
                        offset: 0,
                        limit: 10,
                    },
                });
                if (!watchers.watchers) return;
                const viewers = watchers.watchers.map((user) => ({
                    name: user.name || "",
                    online: !!user.online,
                    id: user.id,
                }));
                setChannelViewers(viewers);
            } catch (error) {
                console.error("Failed to fetch channel viewers:", error);
            }
        };
        updateChannelViewers();

        // Event listeners
        channel.on("user.watching.start", updateChannelViewers);
        channel.on("user.watching.stop", updateChannelViewers);

        // Cleanup
        return () => {
            channel.off("user.watching.start", updateChannelViewers);
            channel.off("user.watching.stop", updateChannelViewers);
        };
    }, [channel]);

    return { channelViewers };
}
