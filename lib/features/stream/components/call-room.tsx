// import { streamApi } from "../apis";
// import { useVideoClient } from "../hooks/use-stream-video";
// import { Call, LivestreamPlayer, StreamCall } from "@stream-io/video-react-sdk";
// import { useEffect, useState } from "react";

// import { Spinner } from "@/components/ui/spinner";

// interface CallRoomProps {
//     children: React.ReactNode;
// }

// export function CallRoom({ children }: CallRoomProps) {
//     const videoClient = useVideoClient();
//     const [call, setCall] = useState<Call | undefined>(undefined);
//     const { data, isPending } = streamApi.query.useGetLivestreamRoom();

//     useEffect(() => {
//         if (isPending || !videoClient || data === undefined) {
//             return;
//         }
//         const myCall = videoClient.call(
//             data.data.room.call.type,
//             data.data.room.call.id,
//         );
//         myCall.join({ create: false, data: data.data.room.call }).then(
//             () => setCall(myCall),
//             () => console.error("Failed to join the call"),
//         );

//         return () => {
//             myCall
//                 .leave()
//                 .catch(() => console.error("Failed to leave the call"));
//             setCall(undefined);
//         };
//     }, [data, isPending, videoClient]);

//     if (!call) return <Spinner />;
//     return <StreamCall call={call}>{children}</StreamCall>;
// }
