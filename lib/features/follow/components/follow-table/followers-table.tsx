import { followApi } from "../../apis";

import { ListSkeleton } from "@/lib/components/community/list-skeleton";
import { useUser } from "@/lib/hooks/use-user";

import { DataTable } from "@/components/data-table";

import { columns } from "./columns";

const dummyDataFollowers = [
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
export function FollowersTable() {
    const { user } = useUser();
    const isFollowerState = false;
    const { data, isPending, error } = followApi.query.useFollow();
    if (data === undefined || isPending) {
        return <ListSkeleton />;
    }
    if (error) {
        return <p>Some thing went wrong</p>;
    }
    const followers = data.data?.followers?.map((follow) => {
        const formattedDate = new Date(follow.createdAt).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            },
        );

        return {
            id: follow.id,
            username: follow.username,
            imageUrl: follow.imageUrl,
            createdAt: formattedDate,
        };
    }) || [];
    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns(user.id, isFollowerState)}
                data={followers}
                pageSizeValue={10}
            />
        </div>
    );
}
