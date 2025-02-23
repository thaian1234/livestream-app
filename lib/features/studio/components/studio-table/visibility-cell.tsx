import { Row } from "@tanstack/react-table";
import { Earth, Link2, LockKeyhole, UserRoundPen } from "lucide-react";
import { useState } from "react";

import { videoApi } from "@/lib/features/video/apis";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { IVideo } from "./studio-columns";

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
            <SelectTrigger className="w-[170px]">
                <SelectValue>
                    <span className="flex flex-row items-center gap-2">
                        {visibility === "private" ? (
                            <LockKeyhole size={20} />
                        ) : visibility === "unlisted" ? (
                            <Link2 size={20} />
                        ) : visibility === "public" ? (
                            <Earth size={20} />
                        ) : (
                            <UserRoundPen size={20} />
                        )}
                        {visibility
                            .split("_")
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                            )
                            .join(" ")}
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="private">
                    <span className="flex flex-row items-center gap-2">
                        <LockKeyhole size={20} /> Private
                    </span>
                </SelectItem>
                <SelectItem value="unlisted">
                    <span className="flex flex-row items-center gap-2">
                        <Link2 size={20} /> Unlisted
                    </span>
                </SelectItem>
                <SelectItem value="public">
                    <span className="flex flex-row items-center gap-2">
                        <Earth size={20} /> Public
                    </span>
                </SelectItem>
                <SelectItem value="followers_only">
                    <span className="flex flex-row items-center gap-2">
                        <UserRoundPen size={20} /> Followers Only
                    </span>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
