import { create } from "zustand";

interface LiveInforStore {
    liveSrceenStatus: {
        cinemaMode: boolean;
    };
    isOpenChatComponent: boolean;
    onToggleChatComponent: () => void;
    setLiveScreenStatus: (mode: string) => void;
    resetLiveScreenStatus: () => void;
}

export const useLiveInfor = create<LiveInforStore>((set) => ({
    liveSrceenStatus: {
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
                cinemaMode: mode === "cinemaMode",
            },
        }));
    },
    resetLiveScreenStatus: () => {
        set(() => ({
            liveSrceenStatus: {
                cinemaMode: false,
            },
        }));
    },
}));
