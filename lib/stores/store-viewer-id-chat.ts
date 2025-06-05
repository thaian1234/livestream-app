import { create } from "zustand";

interface ViewerIdStore {
    viewerId: string | undefined;
    setViewerId: (viewerId: string | undefined) => void;
}

export const useViewerId = create<ViewerIdStore>((set, get) => ({
    viewerId: undefined,
    setViewerId: (viewerId) => {
        set({ viewerId: viewerId });
    },
}));
