"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ChangePasswordForm() {
    const [passwordError, setPasswordError] = useState("");
    const [changePassword, setChangePassword] = useState(false);

    return (
        <Card className="rounded-lg border-2">
            <div className="flex items-start justify-between">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <div className="flex items-center space-x-4">
                    <Label htmlFor="change-password" className="underline">
                        I want to change my password
                    </Label>
                    <Switch
                        id="change-password"
                        checked={changePassword}
                        onCheckedChange={setChangePassword}
                    />
                </div>
            </div>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                        disabled={!changePassword}
                        id="current-password"
                        name="current-password"
                        type="password"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                        disabled={!changePassword}
                        id="new-password"
                        name="new-password"
                        type="password"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                        Confirm New Password
                    </Label>
                    <Input
                        disabled={!changePassword}
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                    />
                </div>
                {passwordError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                )}
                <Button
                    disabled={!changePassword}
                    type="button"
                    onClick={() => setChangePassword(false)}
                >
                    Confirm Password Change
                </Button>
            </CardContent>
        </Card>
    );
}
