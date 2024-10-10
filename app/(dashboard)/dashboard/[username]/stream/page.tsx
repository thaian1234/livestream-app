import { LocalLivestreamPlayer } from "@/lib/features/stream/components/local-livestream-player";

export default function StreamPage() {
    return (
        <div className="container">
            <p>This is livestream page</p>
            <LocalLivestreamPlayer />
        </div>
    );
}
