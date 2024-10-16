import { create } from "zustand";

type ViewElement = HTMLElement | null | undefined;
type VideoElement = HTMLVideoElement | null | undefined;

type States = {
    isFullscreen: boolean;
    volume: number;
    isPaused: boolean;
};
type Actions = {
    handleToggleFullscreen: (participantViewElement: ViewElement) => void;
    handleVolumeChange: (videoElement: VideoElement, value: number) => void;
    handleTogglePaused: (videoElement: VideoElement) => void;
    reset: () => void;
};

const initialState: States = {
    isFullscreen: false,
    isPaused: false,
    volume: 50,
};

export const useControlVideoStore = create<States & Actions>((set, get) => ({
    // States
    ...initialState,
    // Actions
    handleToggleFullscreen: (participantViewElement: ViewElement) => {
        if (!document.fullscreenElement) {
            participantViewElement?.requestFullscreen().catch((err) => {
                console.warn(
                    `Error attempting to enable fullscreen: ${err.message}`,
                );
            });
            set({ isFullscreen: true });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((err) => {
                    console.warn(
                        `Error attempting to exit fullscreen: ${err.message}`,
                    );
                });
            }
            set({ isFullscreen: false });
        }
    },
    handleVolumeChange(videoElement, value) {
        if (videoElement) {
            videoElement.volume = value / 100;
            videoElement.muted = value === 0;
            set({ volume: value });
        }
    },
    handleTogglePaused: (videoElement: VideoElement) => {
        if (videoElement) {
            const isPausing = get().isPaused;
            if (isPausing) {
                videoElement
                    .play()
                    .then(() => {
                        set({
                            isPaused: false,
                        });
                    })
                    .catch((error) => {
                        console.error("Error playing video:", error);
                    });
            } else {
                videoElement.pause();
                set({
                    isPaused: true,
                });
            }
        }
    },
    reset() {
        set(initialState);
    },
}));
