import { create } from "zustand";

interface SidebarStore {
    isOpenSidebar: boolean;
    isHideSidebar: boolean;
    onExpandSidebar: () => void;
    onCollapseSidebar: () => void;
    onHideSidebar: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
    isOpenSidebar: false,
    isHideSidebar: false,
    onExpandSidebar: () => set(() => ({ isOpenSidebar: false })),
    onCollapseSidebar: () => {
        set(() => ({ isOpenSidebar: true }));
    },
    onHideSidebar: () => {
        set((state) => ({ isHideSidebar: !state.isHideSidebar }));
    },
}));
