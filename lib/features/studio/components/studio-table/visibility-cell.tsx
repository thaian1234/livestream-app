import { Row } from "@tanstack/react-table";
import { Earth, Link2, LockKeyhole } from "lucide-react";

import { videoApi } from "@/lib/features/video/apis";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { IVideo } from "./studio-columns";
import { useState } from "react";

export function VisibilityCell({ row }: { row: Row<IVideo> }) {
    const { mutate: updateVisibility } = videoApi.mutation.useUpdateVideo();
    const [visibility, setVisibility] = useState(row.original.visibility);
    //call api to change visibility value in get all Video api
    return (
        <Select
            defaultValue={row.original.visibility}
            onValueChange={(value) => {
                updateVisibility(
                    {
                        param: {
                            id: row.original.id,
                        },
                        json: {
                            visibility: value.toLowerCase() as
                                | "public"
                                | "private"
                                | "followers_only"
                                | "unlisted",
                        },
                    },
                    {
                        onSuccess(data) {
                            setVisibility(data.data.visibility);
                            console.log(visibility);
                        },
                    },
                );
            }}
        >
            <SelectTrigger className="w-[135px]">
                <SelectValue>
                    <span className="flex flex-row items-center gap-2">
                        {visibility === "private" ? (
                            <LockKeyhole size={20} />
                        ) : visibility === "unlisted" ? (
                            <Link2 size={20} />
                        ) : (
                            <Earth size={20} />
                        )}
                        {visibility}
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Private">
                    <span className="flex flex-row items-center gap-2">
                        <LockKeyhole size={20} /> Private
                    </span>
                </SelectItem>
                <SelectItem value="Unlisted">
                    <span className="flex flex-row items-center gap-2">
                        <Link2 size={20} /> Unlisted
                    </span>
                </SelectItem>
                <SelectItem value="Public">
                    <span className="flex flex-row items-center gap-2">
                        <Earth size={20} /> Public
                    </span>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
