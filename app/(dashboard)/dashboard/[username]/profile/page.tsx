import { Suspense } from "react";

import { AccountLayout } from "@/lib/components/dashboard/account/account.layout";
import { UploadImageForm } from "@/lib/features/upload/components/upload-image-form";
import {
    ProfileUpdateForm,
    ProfileUpdateFormSkeleton,
} from "@/lib/features/user/components/profile-update-form";

import { Label } from "@/components/ui/label";

export default function AccountPage() {
    return (
        <AccountLayout
            title="Profile"
            subTitle="This is how others will see you on the site."
        >
            {/* TODO: Adding Profile uploading */}
            <section className="grid lg:grid-cols-12 lg:space-x-8">
                <div className="space-y-4 lg:col-span-7 lg:border-r-2 lg:border-slate-500 lg:pr-8">
                    <Label>Update your Avatar</Label>
                    <UploadImageForm />
                </div>
                <div className="lg:col-span-5">
                    <Suspense fallback={<ProfileUpdateFormSkeleton />}>
                        <ProfileUpdateForm />
                    </Suspense>
                </div>
            </section>
        </AccountLayout>
    );
}
