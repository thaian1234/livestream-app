import { LocalLivestreamPlayer } from "@/lib/features/stream/components/local-livestream-player";

export default function StreamPage() {
    return (
        <div className="container mb-10">
            <p>This is livestream page</p>
            <LocalLivestreamPlayer />
        </div>
    );
}
