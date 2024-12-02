import { streamApi } from "../../apis";
import { SaveAllIcon } from "lucide-react";
import { useRef } from "react";

import { CategoryDTO } from "@/server/api/dtos/category.dto";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MultipleSelector, {
    MultipleSelectorRef,
    Option,
} from "@/components/ui/multi-selector";

interface StreamCategoriesFormProps {
    categories: CategoryDTO.BasicSelect[];
    streamId: string;
}

export function StreamCategoriesForm({
    categories,
    streamId,
}: StreamCategoriesFormProps) {
    const { data, isPending: isPendingCategories } =
        streamApi.query.useGetStreamCategories(streamId);
    const streamMutation = streamApi.mutation.useAddCategoriesToStream();
    const ref = useRef<MultipleSelectorRef>(null);

    if (isPendingCategories) return <p>Loading categories...</p>;
    if (!data || !data.data) return <p>Error: Cannot load categories</p>;

    const values = data.data.map((item) => ({
        label: item.category.name,
        value: item.category.id,
    }));
    const options = categories.map((item) => ({
        label: item.name,
        value: item.id,
    }));

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
                    options={options}
                    hidePlaceholderWhenSelected
                    disabled={streamMutation.isPending}
                    loadingIndicator={
                        <div className="flex items-center justify-center">
                            <span className="text-sm">Saving...</span>
                        </div>
                    }
                />
                <Button
                    onClick={() => {
                        if (!ref.current) return;
                        streamMutation.mutate({
                            json: {
                                streamId: streamId,
                                categoryIds: ref.current.selectedValue.map(
                                    (item) => item.value,
                                ),
                            },
                        });
                    }}
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-transparent"
                    disabled={streamMutation.isPending || !ref.current}
                >
                    <SaveAllIcon />
                </Button>
            </div>
        </div>
    );
}
