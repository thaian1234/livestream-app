import { create } from "zustand";

interface SidebarState {
    isOpen: boolean;
    selectedItem: string;
}
interface SidebarStore {
    sidebarState: SidebarState;
    setSidebarState: (payload: Partial<SidebarState>) => void;
    resetSidebarState: () => void;
}
const useStoreSidebar = create<SidebarStore>((set, get) => ({
    // Initial state
    sidebarState: {
        isOpen: false,
        selectedItem: "",
    },

    // Actions
    //    setSidebarState: (payload: { isOpen: boolean; selectedItem: string }) =>//+

    setSidebarState: (payload) =>
        set((state) => ({
            sidebarState: { ...state.sidebarState, ...payload },
        })),

    resetSidebarState: () =>
        set((state) => ({
            sidebarState: {
                ...state.sidebarState,
                selectedItem: "",
            },
        })),
}));

export default useStoreSidebar;
