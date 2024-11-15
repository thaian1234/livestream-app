import { create } from "zustand";

interface LiveInforStore {
    liveSrceenStatus: {
        cinemaMode: boolean;
    };
    chatStatus: string;
    onChangeChatStatus: () => void;
    isOpenChatComponent: boolean;
    onToggleChatComponent: () => void;
    setLiveScreenStatus: (mode: string) => void;
    resetLiveScreenStatus: () => void;
}

export const useLiveInfor = create<LiveInforStore>((set, get) => ({
    liveSrceenStatus: {
        cinemaMode: false,
    },
    chatStatus: "Chat",
    isOpenChatComponent: true,
    onChangeChatStatus: () => {
        if (get().chatStatus === "Chat")
            set(() => ({
                chatStatus: "Community",
            }));
        else
            set(() => ({
                chatStatus: "Chat",
            }));
    },
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
