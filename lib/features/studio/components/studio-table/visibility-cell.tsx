import { Row } from "@tanstack/react-table";
import { Earth, Link2, LockKeyhole } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { IVideo } from "./studio-columns";

export function VisibilityCell({ row }: { row: Row<IVideo> }) {
    //call api to change visibility value in get all Video api
    return (
        <Select defaultValue={row.original.visibility}>
            <SelectTrigger className="w-[135px]">
                <SelectValue>
                    <span className="flex flex-row items-center gap-2">
                        {row.original.visibility === "Private" ? (
                            <LockKeyhole size={20} />
                        ) : row.original.visibility === "Unlisted" ? (
                            <Link2 size={20} />
                        ) : (
                            <Earth size={20} />
                        )}
                        {row.original.visibility}
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
