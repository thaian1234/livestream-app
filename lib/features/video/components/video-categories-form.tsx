import { SaveAllIcon } from "lucide-react";
import { useRef } from "react";

import { categoryApi } from "@/lib/features/category/apis";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MultipleSelector, {
    MultipleSelectorRef,
} from "@/components/ui/multi-selector";

import { videoApi } from "../apis";

interface VideoCategoriesFormProps {
    videoId: string;
}

export function VideoCategoriesForm({ videoId }: VideoCategoriesFormProps) {
    const { data, isPending: isPendingCategories } =
        videoApi.query.useGetVideoCategories(videoId);
    const { data: allCategories, isPending: isPendingCategory } =
        categoryApi.query.useGetBasic({
            size: "100",
        });
    const videoMutation = videoApi.mutation.useAddCategoriesToVideo();
    const ref = useRef<MultipleSelectorRef>(null);

    if (isPendingCategories || isPendingCategory)
        return (
            <p className="mt-2 text-sm font-medium">Loading categories...</p>
        );
    if (!data || !data.data || !allCategories)
        return (
            <p className="mt-2 text-sm font-medium">
                Error: Cannot load categories
            </p>
        );

    const values = data.data.map((item) => ({
        label: item.category.name,
        value: item.category.id,
    }));
    const options = allCategories.data.categories.map((item) => ({
        label: item.name,
        value: item.id,
    }));
    const handleSearch = async (query: string) => {
        const result = options.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase()),
        );
        return result;
    };
    const handleSave = () => {
        if (!ref.current) return;
        videoMutation.mutate({
            json: {
                videoId: videoId,
                categoryIds: ref.current.selectedValue.map(
                    (item) => item.value,
                ),
            },
        });
    };

    return (
        <div className="space-y-2">
            <Label>Select Categories</Label>
            <div className="flex space-x-4">
                <MultipleSelector
                    ref={ref}
                    value={values}
                    className="bg-black-1"
                    placeholder="Select categories you like..."
                    emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                        </p>
                    }
                    triggerSearchOnFocus
                    hidePlaceholderWhenSelected
                    disabled={videoMutation.isPending}
                    loadingIndicator={
                        <div className="flex items-center justify-center">
                            <span className="text-sm">Saving...</span>
                        </div>
                    }
                    onSearch={handleSearch}
                />
                <Button
                    onClick={handleSave}
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-transparent"
                    loading={videoMutation.isPending}
                >
                    {!videoMutation.isPending && <SaveAllIcon />}
                </Button>
            </div>
        </div>
    );
}
