"use client";

import { useUser } from "@/lib/hooks/use-user";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileInfo() {
    const { user } = useUser();

    return (
        <Card className="rounded-lg border-2">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Check your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input defaultValue={user.username} disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" defaultValue={user.email} disabled />
                </div>
            </CardContent>
        </Card>
    );
}
