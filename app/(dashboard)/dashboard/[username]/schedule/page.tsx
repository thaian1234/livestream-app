"use client";

import "@schedule-x/theme-shadcn/dist/index.css";

import { Schedule } from "@/lib/features/schedule/components/schedule";

export default function SchedulePage() {
    return (
        <article className="p-10">
            <Schedule />
        </article>
    );
}
