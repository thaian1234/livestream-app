import { Suspense } from "react";

import { AccountLayout } from "@/lib/components/dashboard/account/account.layout";
import { UploadImageForm } from "@/lib/features/upload/components/upload-image-form";
import {
    ProfileUpdateForm,
    ProfileUpdateFormSkeleton,
} from "@/lib/features/user/components/profile-update-form";

import { CardSection } from "@/components/card-section";

export default function AccountPage() {
    return (
        <AccountLayout
            title="Profile"
            subTitle="This is how others will see you on the site."
        >
            {/* TODO: Adding Profile uploading */}
            <section className="grid space-y-4 lg:grid-cols-12 lg:space-x-8 lg:space-y-0">
                <div className="space-y-4 lg:col-span-7">
                    <CardSection
                        title="Your avatar"
                        description="Upload your avatar"
                    >
                        <UploadImageForm />
                    </CardSection>
                </div>
                <div className="lg:col-span-5">
                    <CardSection
                        title="Personal Information"
                        description="Update your personal details"
                    >
                        <Suspense fallback={<ProfileUpdateFormSkeleton />}>
                            <ProfileUpdateForm />
                        </Suspense>
                    </CardSection>
                </div>
            </section>
        </AccountLayout>
    );
}
