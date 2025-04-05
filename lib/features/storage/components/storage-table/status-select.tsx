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

import { storageApi } from "../../apis";

interface StatusDropdownProps {
    row: Row<StorageDTO.Select>;
}

const statuses = [
    { value: "draft", label: "Draft" },
    { value: "processing", label: "Processing" },
    { value: "ready", label: "Ready" },
] as const;

export function StatusSelect({ row }: StatusDropdownProps) {
    const [value, setValue] = useState(row.original.status);
    const storageMutation = storageApi.mutation.useUpdateRecording();

    const handleStatusChange = async (newStatus: string) => {
        setValue(newStatus as StorageDTO.Select["status"]);
        storageMutation.mutate(
            {
                param: {
                    id: row.original.id,
                },
                json: {
                    status: newStatus as StorageDTO.Select["status"],
                },
            },
            {
                onError: (err) => {
                    setValue(row.original.status);
                },
            },
        );
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
