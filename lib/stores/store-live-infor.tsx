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
        miniPlayer: boolean;
        fullScreen: boolean;
        cinemaMode: boolean;
    };
    isChatComponent: boolean;
    onChangeChatComponent: () => void;
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
            isChatComponent: true,
            onChangeChatComponent: () => {
                set((state) => ({ isChatComponent: !state.isChatComponent }));
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
                        miniPlayer: mode === "miniPlayer",
                        fullScreen: mode === "fullScreen",
                        cinemaMode: mode === "cinemaMode",
                    },
                }));
            },
            resetLiveScreenStatus: () => {
                set(() => ({
                    liveSrceenStatus: {
                        miniPlayer: false,
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
