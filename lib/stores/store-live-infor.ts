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
    isOpenPrivateChat: boolean;
    onTogglePrivateChat: () => void;
}

export const useLiveInfor = create<LiveInforStore>((set, get) => ({
    liveSrceenStatus: {
        cinemaMode: false,
    },
    chatStatus: ChatStatus.Chat,
    isOpenChatComponent: true,
    isOpenPrivateChat: false,
    onTogglePrivateChat: () => {
        set((state) => ({ isOpenPrivateChat: !state.isOpenPrivateChat }));
    },
    onChangeChatStatus(chatStatus) {
        set(() => ({ chatStatus, isOpenPrivateChat: false }));
    },
    onToggleChatComponent: () => {
        set((state) => ({
            isOpenChatComponent: !state.isOpenChatComponent,
        }));
    },
}));
