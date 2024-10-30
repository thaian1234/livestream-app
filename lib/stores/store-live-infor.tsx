import { create } from "zustand";

interface LiveInforStore {
    liveSrceenStatus: {
        fullScreen: boolean;
        cinemaMode: boolean;
    };
    isOpenChatComponent: boolean;
    onToggleChatComponent: () => void;
    setLiveScreenStatus: (mode: string) => void;
    resetLiveScreenStatus: () => void;
}

export const useLiveInfor = create<LiveInforStore>((set) => ({
    liveSrceenStatus: {
        fullScreen: false,
        cinemaMode: false,
    },
    isOpenChatComponent: true,
    onToggleChatComponent: () => {
        set((state) => ({
            isOpenChatComponent: !state.isOpenChatComponent,
        }));
    },
    setLiveScreenStatus: (mode) => {
        set(() => ({
            liveSrceenStatus: {
                fullScreen: mode === "fullScreen",
                cinemaMode: mode === "cinemaMode",
            },
        }));
    },
    resetLiveScreenStatus: () => {
        set(() => ({
            liveSrceenStatus: {
                fullScreen: false,
                cinemaMode: false,
            },
        }));
    },
}));
