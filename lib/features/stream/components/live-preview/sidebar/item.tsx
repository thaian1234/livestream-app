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
    {
        id: "6",
        avatar: "/user.svg",
        title: "Average Order Value",
        userName: "Average Order Value",
        viewers: "32",
    },
    {
        id: "7",
        avatar: "/user.svg",
        title: "Bounce Rate",
        userName: "Bounce Rate",
        viewers: "12",
    },
    {
        id: "8",
        avatar: "/user.svg",
        title: "Page Load Time",
        userName: "Page Load Time",
        viewers: "357",
    },
    {
        id: "9",
        avatar: "/user.svg",
        title: "Support Tickets",
        userName: "Support Tickets",
        viewers: "5457",
    },
    {
        id: "10",
        avatar: "/user.svg",
        title: "Server Uptime",
        userName: "Server Uptime",
        viewers: "5671",
    },
    {
        id: "11",
        avatar: "/user.svg",
        title: "Inventory Turnover",
        userName: "Inventory Turnover",
        viewers: "5655  ",
    },
    {
        id: "12",
        avatar: "/user.svg",
        title: "Net Promoter Score",
        userName: "Net Promoter Score",
        viewers: "5",
    },
];
export function Item() {
    return (
        <>
            {livePreviewData.map((livePreview, index) => (
                <button
                    key={index}
                    className="flex w-full items-center justify-between bg-transparent py-2 hover:bg-search"
                >
                    <div className="flex items-center space-x-2">
                        <Image
                            className="rounded-full"
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
