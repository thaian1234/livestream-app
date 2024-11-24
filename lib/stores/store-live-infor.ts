import { create } from "zustand";

export enum ChatStatus {
    Chat = "CHAT",
    Community = "COMMUNITY",
}

interface LiveInforStore {
    liveSrceenStatus: {
        cinemaMode: boolean;
    };
    chatStatus: ChatStatus;
    onChangeChatStatus: (chatStatus: ChatStatus) => void;
    isOpenChatComponent: boolean;
    onToggleChatComponent: () => void;
}

export const useLiveInfor = create<LiveInforStore>((set, get) => ({
    liveSrceenStatus: {
        cinemaMode: false,
    },
    chatStatus: ChatStatus.Chat,
    isOpenChatComponent: true,
    onChangeChatStatus(chatStatus) {
        set(() => ({ chatStatus }));
    },
    onToggleChatComponent: () => {
        set((state) => ({
            isOpenChatComponent: !state.isOpenChatComponent,
        }));
    },
}));
