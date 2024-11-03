import React from "react";

import { UserPreviewCard } from "./user-preview-card";

const dataUser = [
    {
        id: "1",
        username: "userrrr",
        imageUrl: "/user.svg",
        followers: 1200,
        bio: "- Shop Khô hường Bình Trị Đông B, Quận Bình Tân TPHCM.Page: https://www.facebook.com/BanhTamThayBaWebsite: https://banhtamthayba.comShopeeFood: https://s.net.vn/244NGrabFood: https://s.net.vn/m18b- Contact Công Việc:Page: https://www.facebook.com/BaRoiBe0Mail: BaRoiBeoKols1989@gmail.com.",
    },
    {
        id: "1",
        username: "userr",
        imageUrl: "/user.svg",
        followers: 1000,
        bio: "- Shop ườn nh Trị Đông B, Sho  ườn nh Trị Đông B Quận Bình Tân TPHCM.Page: https://www.fa ườn nh Trị Đông B Quận Bình Tân TPHCM.Page: https://www.fap ườn nh Trị Đông B Quận Bình Tân TPHCM.Page: https://www.facebook.cog Bình Trị Đông B, Quận Bình Tân TPHCM.Page: https://www.facebook.co Khô Gà Thầy Giáo Ba: https://shopee.vn/thaygiaoba_1107- Bánh Tằm Thầy Ba:CS 1: 342 Tên Lửa Phường Bình Trị Đông B, Quận Bình Tân TPHCM.Page: https://www.facebook.com/BanhTamThayBaWebsite: https://banhtamthayba.comShopeeFood: https://s.net.vn/244NGrabFood: https://s.net.vn/m18b- Contact Công Việc:Page: https://www.facebook.com/BaRoiBe0Mail: BaRoiBeoKols1989@gmail.com.",
    },
    {
        id: "1",
        username: "user3",
        imageUrl: "/user.svg",
        followers: 800,
        bio: "- Shop Khô Gà Thầy Giáo Ba:",
    },
    {
        id: "1",
        username: "user4",
        imageUrl: "/user.svg",
        followers: 700,
        bio: "- Shop Khô Gà T2 Tên Lửa Phường Bình Trị Đông B, Quận Bình Tân TPHCM.Page: https://www.facebook.com/BanhTamThayBaWebsite: https://banhtamthayba.comShopeeFood: https://s.net.vn/244NGrabFood: https://s.net.vn/m18b- Contact Công Việc:Page: https://www.facebook.com/BaRoiBe0Mail: BaRoiBeoKols1989@gmail.com.",
    },
    {
        id: "1",
        username: "user4",
        imageUrl: "/user.svg",
        followers: 700,
        bio: "- Shop Khô Gà Thầy Gi",
    },
    {
        id: "1",
        username: "user4",
        imageUrl: "/user.svg",
        followers: 700,
        bio: "- Shop Khô Gà Thầy Giáo Ba: https://shopee.vn/thaygiaoba_1107- Bánh Tằm Thầy Ba:CS 1: 342 Tên Lửa Phường Bình Trị Đông B, Quận Bình Tân TPHCM.Page: https://www.facebook.com/BanhTamThayBaWebsite: https://banhtamthayba.comShopeeFood: https://s.net.vn/244NGrabFood: https://s.net.vn/m18b- Contact Công Việc:Page: https://www.facebook.com/BaRoiBe0Mail: BaRoiBeoKols1989@gmail.com.",
    },
    {
        id: "1",
        username: "user4",
        imageUrl: "/user.svg",
        followers: 700,
        bio: "- Shop Khô Gà Thầy Giáo Ba: https://shopee.vn/thaygia 342 Tên Lửa Phường Bình Trị Đông B, Quận Bình Tân TPHCM.Page: https://www.facebook.com/BanhTamThayBaWebsite: https://banhtamthayba.comShopeeFood: https://s.net.vn/244NGrabFood: https://s.net.vn/m18b- Contact Công Việc:Page: https://www.facebook.com/BaRoiBe0Mail: BaRoiBeoKols1989@gmail.com.",
    },
    {
        id: "1",
        username: "user4",
        imageUrl: "/user.svg",
        followers: 700,
        bio: "- Shop Khô Gà Thầy Giáo Ba: https://shopee.vn/thaygiaoba_1107- Bánh Tằm Thầy Ba:CS 1: 342 Tê https://s.net.vn/244NGrabFood: https://s.net.vn/m18b- Contact Công Việc:Page: https://www.facebook.com/BaRoiBe0Mail: BaRoiBeoKols1989@gmail.com.",
    },
];

interface UserInfo {
    id: string;
    username: string;
    imageUrl: string;
    followers: number;
    bio: string;
}

interface UserPreviewProps {
    limit?: number;
    users?: UserInfo[];
}

export function UserPreview({ limit, users }: UserPreviewProps) {
    return (
        <>
            {dataUser.slice(0, limit || dataUser.length).map((user, index) => (
                <UserPreviewCard
                    key={index}
                    id={user.id}
                    username={user.username}
                    imageUrl={user.imageUrl}
                    followers={user.followers}
                />
            ))}
        </>
    );
}
