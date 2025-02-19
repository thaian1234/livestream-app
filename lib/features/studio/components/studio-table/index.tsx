"use client";

import { useState } from "react";

import { DataTablePagination } from "@/components/data-table-pagination";

import { IVideo, StudioColumns } from "./studio-columns";

const dummyDataVideos: IVideo[] = [
    {
        id: 1,
        name: "Introduction to React",
        avatarUrl: "/user.svg",
        thumbnailUrl: "/placeholder.svg?height=120&width=200",
        videoUrl: "http://localhost:3000/",
        visibility: "Public",
        date: "15/05/2024",
        views: 150000000,
        comments: 230,
        likes: 1200,
        dislikes: 50,
    },
    {
        id: 2,
        name: "Advanced CSS Techniques Advan     CSS Techniques Advanced CSS Techniques Advanced CSS Techniques Advanced CSS Techniques",
        avatarUrl: "/user.svg",
        thumbnailUrl: "/placeholder.svg?height=120&width=200",
        videoUrl: "https://example.com/video2",
        visibility: "Unlisted",
        date: "02/06/2023",
        views: 8500,
        comments: 120,
        likes: 950,
        dislikes: 30,
    },
    {
        id: 3,
        name: "JavaScript ES6 Features",
        avatarUrl: "/user.svg",
        thumbnailUrl: "/placeholder.svg?height=120&width=200",
        videoUrl: "https://example.com/video3",
        visibility: "Private",
        date: "20/06/2023",
        views: 12000,
        comments: 180,
        likes: 1100,
        dislikes: 40,
    },
];

export function StudioTable() {
    //phân trang
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    //call api get all video
    return (
        <>
            {dummyDataVideos && (
                <DataTablePagination
                    columns={StudioColumns}
                    data={dummyDataVideos}
                    totalPages={1} //lấy từ api
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                />
            )}
        </>
    );
}
