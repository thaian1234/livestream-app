import LivePreviewCard from "@/lib/features/live-preview/live-preview-card";

export const cardData = [
    {
        title: "Total Revenue",
        userName: "$1,234,567.89",
        category: " month",
        thumnail: "/user.svg",
        viewers: "15%",
    },
    {
        title: "Active Users",
        userName: "45,678",
        category: "users",
        thumnail: "/user.svg",
        viewers: "5%",
    },
    {
        title: "New Signups",
        userName: "1,234",
        category: " week",
        thumnail: "/user.svg",
        viewers: "3%",
    },
    {
        title: "Customer Satisfaction",
        userName: "4.7/5",
        category: "reviews",
        thumnail: "/user.svg",
        viewers: "0.2",
    },
    {
        title: "Conversion Rate",
        userName: "3.45%",
        category: " week",
        thumnail: "/user.svg",
        viewers: "0.5%",
    },
    {
        title: "Average Order Value",
        userName: "$78.90",
        category: " month",
        thumnail: "/user.svg",
        viewers: "$3.20",
    },
    {
        title: "Bounce Rate",
        userName: "32.8%",
        category: "week",
        thumnail: "/user.svg",
        viewers: "1.2%",
    },
    {
        title: "Page Load Time",
        userName: "1.2s",
        category: " improvement",
        thumnail: "/user.svg",
        viewers: "0.1s",
    },
    {
        title: "Support Tickets",
        userName: "156",
        category: "hours",
        thumnail: "/user.svg",
        viewers: "5%",
    },
    {
        title: "Server Uptime",
        userName: "99.99%",
        category: "month",
        thumnail: "/user.svg",
        viewers: "0.01%",
    },
    {
        title: "Inventory Turnover",
        userName: "4.5x",
        category: "quarter",
        thumnail: "/user.svg",
        viewers: "0.3x",
    },
    {
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
                />
            ))}
        </>
    );
}
