import { BlockItem } from "./block-item";

const dataBlock = [
    { id: "1", username: "Channel 1", imageUrl: "/user.svg", status: true },
    { id: "2", username: "Channel 2", imageUrl: "/user.svg", status: true },
    { id: "3", username: "Channel 3", imageUrl: "/user.svg", status: true },
    { id: "4", username: "Channel 4", imageUrl: "/user.svg", status: true },
    { id: "5", username: "Channel 5", imageUrl: "/user.svg", status: true },
    { id: "6", username: "Channel 6", imageUrl: "/user.svg", status: true },
    { id: "7", username: "Channel 7", imageUrl: "/user.svg", status: true },
    { id: "8", username: "Channel 8", imageUrl: "/user.svg", status: true },
    { id: "9", username: "Channel 9", imageUrl: "/user.svg", status: true },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg", status: true },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg", status: true },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg", status: true },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg", status: true },
    { id: "10", username: "Channel 10", imageUrl: "/user.svg", status: true },
];
export function BlockList() {
    return (
        <div className="flex h-full flex-col py-4 text-card-foreground shadow-sm">
            {dataBlock && <BlockItem blocks={dataBlock} />}
        </div>
    );
}
