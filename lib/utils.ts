import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

export function parseVietnameseDateTime(dateString: string) {
    const vietnamDate = new Date(
        new Date(dateString).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
        }),
    );
    return vietnamDate;
}
