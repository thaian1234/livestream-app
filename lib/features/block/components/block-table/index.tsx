import { useUser } from "@/lib/hooks/use-user";

import { DataTable } from "@/components/data-table";

import { columns } from "./columns";
import { ListSkeleton } from "@/lib/components/community/list-skeleton";
import { userApi } from "@/lib/features/user/apis";
import { blockApi } from "../../apis";

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
    const { data, isPending, error } = blockApi.query.useBlock("1", "10", user.id);
    if (data === undefined || isPending) {
        return <ListSkeleton />;
    }
    if (error) {
        return <p>Some thing went wrong</p>;
    }
    const blockeds = data.data?.blockeds?.map((block) => {
        const formattedDate = new Date(block.createdAt).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            },
        );

        return {
            id: block.id,
            username: block.username,
            imageUrl: block.imageUrl,
            createdAt: formattedDate,
        };
    }) || [];
    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns(user.id)}
                data={blockeds}
                pageSizeValue={10}
            />
        </div>
    );
}
