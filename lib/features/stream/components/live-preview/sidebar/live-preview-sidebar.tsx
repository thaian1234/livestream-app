import { UsersRound } from "lucide-react";
import Image from "next/image";

export const livePreviewData = [
    {
        id: "1",
        avatar: "/user.svg",
        title: "Total Revenue",
        userName: "Total Revenue",
        viewers: "15",
    },
    {
        id: "2",
        avatar: "/user.svg",
        title: "Active Users",
        userName: "Active Users",
        viewers: "5",
    },
    {
        id: "3",
        avatar: "/user.svg",
        title: "New Signups",
        userName: "New Signups",
        viewers: "30",
    },
    {
        id: "4",
        avatar: "/user.svg",
        title: "Customer Satisfaction",
        userName: "Customer Satisfactionnnnn",
        viewers: "200",
    },
    {
        id: "5",
        avatar: "/user.svg",
        title: "Customer Satisfaction",
        userName: "Customer Satisfactionnnnn",
        viewers: "90",
    },
];
export function LivePreviewSidebar() {
    const handleNavigate = (liveId: String) => {
        // Navigate to the live page
    };
    return (
        <>
            {livePreviewData.map((livePreview, index) => (
                <button
                    onClick={() => handleNavigate(livePreview.id)}
                    key={index}
                    className="flex w-full items-center justify-between rounded-sm bg-transparent py-2 pr-4 hover:bg-search"
                >
                    <div className="flex items-center space-x-4">
                        <Image
                            className="flex-shrink-0 rounded-full"
                            src={livePreview.avatar}
                            alt={livePreview.userName}
                            height={40}
                            width={40}
                        />
                        <div className="w-auto truncate text-base">
                            {livePreview.userName}
                        </div>
                    </div>

                    <div className="flex space-x-1 pl-1">
                        <UsersRound size={16} />
                        <span className="text-sm">{livePreview.viewers}</span>
                    </div>
                </button>
            ))}
        </>
    );
}
