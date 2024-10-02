import { StreamVideoProvider } from "@/lib/providers/stream-video-provider";

export default function StreamPage() {
    return (
        <StreamVideoProvider>
            <p>This is livestream page</p>
        </StreamVideoProvider>
    );
}
