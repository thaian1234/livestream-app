"use client";

import { Suspense, useState } from "react";

import { UploadImageForm } from "@/lib/features/upload/components/upload-image-form";
import {
    ProfileUpdateForm,
    ProfileUpdateFormSkeleton,
} from "@/lib/features/user/components/profile-update-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CardSection } from "@/components/card-section";

interface EditProfileDialogProps {
    children: React.ReactNode;
}
export function EditProfileDialog({ children }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[calc(100vh-10rem)] px-2 transition-all duration-300 ease-in-out">
                    <div className="space-y-2">
                        <CardSection
                            title="Your avatar"
                            description="Upload your avatar"
                        >
                            <UploadImageForm />
                        </CardSection>
                        <CardSection
                            title="Personal Information"
                            description="Update your personal details"
                        >
                            <Suspense fallback={<ProfileUpdateFormSkeleton />}>
                                <ProfileUpdateForm />
                            </Suspense>
                        </CardSection>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
