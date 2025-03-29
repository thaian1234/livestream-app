"use client";

import { Row } from "@tanstack/react-table";
import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { IStorage } from "../../types/storage";

interface StatusDropdownProps {
    row: Row<IStorage>;
}

const statuses = [
    { value: "draft", label: "Draft" },
    { value: "processing", label: "Processing" },
    { value: "ready", label: "Ready" },
];

export function StatusSelect({ row }: StatusDropdownProps) {
    const [value, setValue] = useState(row.original.status);

    const handleStatusChange = (newStatus: string) => {
        setValue(newStatus as IStorage["status"]);
        // TODO: Implement status update logic here
        console.log("Status changed to:", newStatus);
    };

    return (
        <Select value={value} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
                <SelectValue>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                        {status.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
