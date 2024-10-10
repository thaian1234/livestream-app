import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarToggleStore {
    isOpen: boolean;
    setIsOpen: () => void;
}

export const useSidebarToggle = create(
    persist<SidebarToggleStore>(
        (set, get) => ({
            isOpen: true,
            setIsOpen: () => {
                set({ isOpen: !get().isOpen });
            },
        }),
        {
            name: "sidebarOpen",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
