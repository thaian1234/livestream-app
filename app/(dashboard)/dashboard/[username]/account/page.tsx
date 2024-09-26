import { Suspense } from "react";

import { AccountLayout } from "@/lib/components/dashboard/account/account.layout";
import { UploadImageForm } from "@/lib/features/upload/components/upload-image-form";
import { ProfileUpdateForm } from "@/lib/features/user/components/profile-update-form";

import { Label } from "@/components/ui/label";

export default function AccountPage() {
    return (
        <AccountLayout title="Account" subTitle="Update your account settings.">
            {/* TODO: Adding Profile uploading */}
            <section className="grid grid-cols-12 space-x-8">
                <div className="col-span-7 space-y-4 border-r-2 border-slate-500 pr-8">
                    <Label>Update your Avatar</Label>
                    <UploadImageForm />
                </div>
                <div className="col-span-5">
                    <Suspense fallback={<p>loading...</p>}>
                        <ProfileUpdateForm />
                    </Suspense>
                </div>
            </section>
        </AccountLayout>
    );
}
