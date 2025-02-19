import { Row } from "@tanstack/react-table";

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
            <SelectTrigger className="w-[110px]">
                <SelectValue>{row.original.visibility}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Unlisted">Unlisted</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
            </SelectContent>
        </Select>
    );
}
