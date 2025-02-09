import { create } from "zustand";

export enum ChatStatus {
    Chat = "CHAT",
    PrivateChat = "PRIVATE CHAT",
}

interface LiveInforStore {
    liveSrceenStatus: {
        cinemaMode: boolean;
    };
    chatStatus: ChatStatus;
    onChangeChatStatus: (chatStatus: ChatStatus) => void;
    isOpenChatComponent: boolean;
    onToggleChatComponent: () => void;
    isOpenCommunity: boolean;
    onToggleCommunity: () => void;
}

export const useLiveInfor = create<LiveInforStore>((set, get) => ({
    liveSrceenStatus: {
        cinemaMode: false,
    },
    chatStatus: ChatStatus.Chat,
    isOpenChatComponent: true,
    isOpenCommunity: false,
    onToggleCommunity: () => {
        set((state) => ({ isOpenCommunity: !state.isOpenCommunity }));
    },
    onChangeChatStatus(chatStatus) {
        set(() => ({ chatStatus, isOpenCommunity: false }));
    },
    onToggleChatComponent: () => {
        set((state) => ({
            isOpenChatComponent: !state.isOpenChatComponent,
        }));
    },
}));
