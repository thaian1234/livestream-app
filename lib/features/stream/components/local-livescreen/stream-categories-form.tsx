import { streamApi } from "../../apis";
import { SaveAllIcon } from "lucide-react";
import { useRef } from "react";

import { categoryApi } from "@/lib/features/category/apis";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MultipleSelector, {
    MultipleSelectorRef,
} from "@/components/ui/multi-selector";

interface StreamCategoriesFormProps {
    streamId: string;
}

export function StreamCategoriesForm({ streamId }: StreamCategoriesFormProps) {
    const { data, isPending: isPendingCategories } =
        streamApi.query.useGetStreamCategories(streamId);
    const { data: allCategories, isPending: isPendingCategory } =
        categoryApi.query.useGetBasic({
            size: "100",
        });
    const streamMutation = streamApi.mutation.useAddCategoriesToStream();
    const ref = useRef<MultipleSelectorRef>(null);

    if (isPendingCategories || isPendingCategory)
        return <p>Loading categories...</p>;
    if (!data || !data.data || !allCategories)
        return <p>Error: Cannot load categories</p>;

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
        streamMutation.mutate({
            json: {
                streamId: streamId,
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
                    placeholder="Select categories you like..."
                    emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                        </p>
                    }
                    triggerSearchOnFocus
                    hidePlaceholderWhenSelected
                    disabled={streamMutation.isPending}
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
                    disabled={streamMutation.isPending}
                >
                    <SaveAllIcon />
                </Button>
            </div>
        </div>
    );
}
