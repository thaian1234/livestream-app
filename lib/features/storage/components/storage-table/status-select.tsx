"use client";

import { Row } from "@tanstack/react-table";
import { useState } from "react";

import { StorageDTO } from "@/server/api/dtos/storage.dto";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface StatusDropdownProps {
    row: Row<StorageDTO.Select>;
}

const statuses = [
    { value: "draft", label: "Draft" },
    { value: "processing", label: "Processing" },
    { value: "ready", label: "Ready" },
];

export function StatusSelect({ row }: StatusDropdownProps) {
    const [value, setValue] = useState(row.original.status);

    const handleStatusChange = (newStatus: string) => {
        setValue(newStatus as StorageDTO.Select["status"]);
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
