import { create } from "zustand";

interface CategoryTreeState {
    selectedIds: string[];
    expandedIds: string[];
    handleSelect: (categoryId: string) => void;
    handleExpand: (categoryId: string) => void;
    reset: () => void;
}

export const useCategoryTree = create<CategoryTreeState>((set) => ({
    selectedIds: [],
    expandedIds: [],

    handleSelect: (categoryId: string) =>
        set((state) => ({
            selectedIds: state.selectedIds.includes(categoryId)
                ? state.selectedIds.filter((id) => id !== categoryId)
                : [...state.selectedIds, categoryId],
        })),

    handleExpand: (categoryId: string) =>
        set((state) => ({
            expandedIds: state.expandedIds.includes(categoryId)
                ? state.expandedIds.filter((id) => id !== categoryId)
                : [...state.expandedIds, categoryId],
        })),

    reset: () => set({ selectedIds: [], expandedIds: [] }),
}));
