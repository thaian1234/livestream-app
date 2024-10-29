import { Chat } from "@/lib/features/stream/components/chat";
import { LocalLivestreamPlayer } from "@/lib/features/stream/components/local-livescreen/local-livestream-player";

export default function StreamPage() {
    return (
        <div className="container mb-10">
            <p>This is livestream page</p>
            <LocalLivestreamPlayer />
            <Chat />
        </div>
    );
}
