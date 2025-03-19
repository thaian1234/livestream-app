import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
        format(dateString, "yyyy-MM-dd HH:mm", {
            locale: vi,
        }),
    );
    return vietnamDate;
}
