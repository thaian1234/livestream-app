import { create } from "zustand";

interface SidebarStore {
    isOpenSidebar: boolean;
    isHideSidebar: boolean;
    onExpandSidebar: () => void;
    onCollapseSidebar: () => void;
    onHideSidebar: () => void;
    onShowSidebar: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
    isOpenSidebar: false,
    isHideSidebar: false,
    onExpandSidebar: () => set(() => ({ isOpenSidebar: false })),
    onCollapseSidebar: () => {
        set(() => ({ isOpenSidebar: true }));
    },
    onHideSidebar: () => {
        set(() => ({ isHideSidebar: true }));
    },
    onShowSidebar: () => {
        set(() => ({ isHideSidebar: false }));
    },
}));
