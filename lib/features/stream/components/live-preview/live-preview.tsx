import LivePreviewCard from "./live-preview-card";

export const cardData = [
    {
        avatar: "/user.svg",
        title: "Total Revenue",
        userName: "$1,234,567.89",
        category: " month",
        thumnail: "/user.svg",
        viewers: "15",
    },
    {
        avatar: "/user.svg",
        title: "Active Users",
        userName: "45,678",
        category: "users",
        thumnail: "/user.svg",
        viewers: "5",
    },
    {
        avatar: "/user.svg",
        title: "New Signups",
        userName: "1,234",
        category: " week",
        thumnail: "/user.svg",
        viewers: "30",
    },
    {
        avatar: "/user.svg",
        title: "Customer Satisfaction",
        userName: "4.7/5",
        category: "reviews",
        thumnail: "/user.svg",
        viewers: "200",
    },
    {
        avatar: "/user.svg",
        title: "Conversion Rate",
        userName: "3.45%",
        category: " week",
        thumnail: "/user.svg",
        viewers: "90",
    },
    {
        avatar: "/user.svg",
        title: "Average Order Value",
        userName: "$78.90",
        category: " month",
        thumnail: "/user.svg",
        viewers: "32",
    },
    {
        avatar: "/user.svg",
        title: "Bounce Rate",
        userName: "32.8%",
        category: "week",
        thumnail: "/user.svg",
        viewers: "12",
    },
    {
        avatar: "/user.svg",
        title: "Page Load Time",
        userName: "1.2s",
        category: " improvement",
        thumnail: "/user.svg",
        viewers: "357",
    },
    {
        avatar: "/user.svg",
        title: "Support Tickets",
        userName: "156",
        category: "hours",
        thumnail: "/user.svg",
        viewers: "5457",
    },
    {
        avatar: "/user.svg",
        title: "Server Uptime",
        userName: "99.99%",
        category: "month",
        thumnail: "/user.svg",
        viewers: "5671",
    },
    {
        avatar: "/user.svg",
        title: "Inventory Turnover",
        userName: "4.5x",
        category: "quarter",
        thumnail: "/user.svg",
        viewers: "5655  ",
    },
    {
        avatar: "/user.svg",
        title: "Net Promoter Score",
        userName: "72",
        category: "survey",
        thumnail: "/user.svg",
        viewers: "5",
    },
];

export function LivesPreview() {
    return (
        <>
            {cardData.map((card, index) => (
                <LivePreviewCard
                    key={index}
                    title={card.title}
                    userName={card.userName}
                    thumnail={card.thumnail}
                    category={card.category}
                    viewers={card.viewers}
                    avatar={card.avatar}
                />
            ))}
        </>
    );
}
