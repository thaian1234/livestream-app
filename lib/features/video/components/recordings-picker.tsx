"use client";

import { CallRecording } from "@stream-io/node-sdk";
import { Search } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { videoApi } from "../apis";

interface RecordingsPickerProps {
    selectedRecording: CallRecording | null;
    onSelect: (recording: CallRecording) => void;
}

export function RecordingsPicker({
    selectedRecording,
    onSelect,
}: RecordingsPickerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isPending } = videoApi.query.useGetRecordings();

    if (isPending || !data) return <div>Loading...</div>;

    const filteredRecordings = data.data.recordings.filter((recording) =>
        recording.filename.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleRecordingSelect = (url: string) => {
        const recording = data.data.recordings.find(
            (recording) => recording.url === url,
        );
        if (!recording) return;

        onSelect({
            end_time: new Date(recording.end_time),
            start_time: new Date(recording.start_time),
            url: recording.url,
            filename: recording.filename,
        });
    };

    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatFileName = (filename: string, index: number) => {
        const timestamp = filename.match(/\d+(?=\.mp4)/)?.[0];
        const date = new Date(Number(timestamp));
        const resolution = filename.match(/\d+p/)?.[0] || "";

        // Format as: "Recording - 720p - Feb 14, 2024"
        return `${index}. Recording - ${resolution} - ${date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            },
        )}`;
    };

    return (
        <div className="p-4">
            <h1 className="mb-4 text-base font-bold">
                Choose a Recording to Create Video
            </h1>
            <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" />
                <Input
                    type="text"
                    placeholder="Find recordings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
            <RadioGroup
                value={selectedRecording?.url || ""}
                onValueChange={handleRecordingSelect}
            >
                {filteredRecordings.map((recording, index) => (
                    <div
                        key={recording.url}
                        className="flex items-center space-x-3 rounded p-2"
                    >
                        <RadioGroupItem
                            value={recording.url}
                            id={`recording-${recording.url}`}
                        />
                        <Label
                            htmlFor={`recording-${recording.url}`}
                            className="flex flex-grow cursor-pointer items-center justify-between space-x-3"
                        >
                            <span className="max-w-[80%] flex-grow truncate">
                                {formatFileName(recording.filename, index + 1)}
                            </span>
                            <span className="whitespace-nowrap text-sm text-gray-500">
                                {formatTime(recording.start_time)} -{" "}
                                {formatTime(recording.end_time)}
                            </span>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            {filteredRecordings.length === 0 && (
                <p className="text-center text-gray-500">
                    No recordings founded.
                </p>
            )}
        </div>
    );
}
