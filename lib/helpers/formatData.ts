import { ImageUrlType } from "../types";

export interface CommunityData {
    createdAt: string;
    id: string;
    username: string;
    imageUrl?: ImageUrlType;
    email: string;
}

export function formatCommunityData(data: CommunityData) {
    const formattedDate = new Date(data.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return {
        id: data.id,
        username: data.username,
        imageUrl: data.imageUrl,
        createdAt: formattedDate,
    };
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toLocaleString("vi-VN", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Ho_Chi_Minh",
    });
};
