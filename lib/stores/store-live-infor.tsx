import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LiveInforStore {
    infor: {
        id: string;
        userName: string;
        avatar: string;
        title: string;
        viewers: string;
        followers: string;
    };
    liveSrceenStatus: {
        fullScreen: boolean;
        cinemaMode: boolean;
    };
    isOpenChatComponent: boolean;
    onToggleChatComponent: () => void;
    setLiveInfor: (payload: any) => void;
    setViewer: (viewer: string) => void;
    setLiveScreenStatus: (mode: string) => void;
    resetLiveScreenStatus: () => void;
}

export const useLiveInfor = create(
    persist<LiveInforStore>(
        (set) => ({
            infor: {
                id: "",
                userName: "",
                avatar: "",
                title: "",
                viewers: "",
                followers: "",
            },
            liveSrceenStatus: {
                miniPlayer: false,
                fullScreen: false,
                cinemaMode: false,
            },
            isOpenChatComponent: true,
            onToggleChatComponent: () => {
                set((state) => ({
                    isOpenChatComponent: !state.isOpenChatComponent,
                }));
            },
            setLiveInfor: (payload) => {
                set((state) => ({
                    infor: {
                        ...state.infor,
                        id: payload.id,
                        userName: payload.userName,
                        avatar: payload.avatar,
                        title: payload.title,
                        viewers: payload.viewers,
                        followers: payload.followers,
                    },
                }));
            },
            setViewer: (viewer) => {
                set((state) => ({
                    infor: {
                        ...state.infor,
                        viewer: viewer,
                    },
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
        }),
        {
            name: "liveInfor",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
