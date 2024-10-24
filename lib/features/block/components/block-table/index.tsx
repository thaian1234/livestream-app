import { useUser } from "@/lib/hooks/use-user";

import { DataTable } from "@/components/data-table";

import { columns } from "./columns";

const dataBlock = [
    { id: "1", username: "Channel 1", imageUrl: "/user.svg" },
    { id: "2", username: "Channel 2", imageUrl: "/user.svg" },
    { id: "3", username: "Channel 3", imageUrl: "/user.svg" },
    { id: "4", username: "Channel 4", imageUrl: "/user.svg" },
    { id: "5", username: "Channel 5", imageUrl: "/user.svg" },
    { id: "6", username: "Channel 6", imageUrl: "/user.svg" },
    { id: "7", username: "Channel 7", imageUrl: "/user.svg" },
    { id: "8", username: "Channel 8", imageUrl: "/user.svg" },
    { id: "9", username: "Channel 9", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg" },
];
export function BlockTable() {
    const { user } = useUser();

    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns(user.id)}
                data={dataBlock}
                pageSizeValue={10}
            />
        </div>
    );
}
