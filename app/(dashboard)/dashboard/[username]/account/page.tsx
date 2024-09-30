import { Suspense } from "react";

import { AccountLayout } from "@/lib/components/dashboard/account/account.layout";
import { ConnectedAccount } from "@/lib/features/auth/components/connected-account";
import {
    ChangePasswordForm,
    ChangePasswordFormSkeleton,
} from "@/lib/features/user/components/change-password-form";
import {
    ProfileInfo,
    ProfileInfoSkeleton,
} from "@/lib/features/user/components/profile-info";
import { SocialLinks } from "@/lib/features/user/components/social-links";

import { CardSection } from "@/components/card-section";

export default function AccountPage() {
    return (
        <AccountLayout title="Account" subTitle="Update your account settings">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CardSection
                    title="Personal information"
                    description="Check your information"
                >
                    <Suspense fallback={<ProfileInfoSkeleton />}>
                        <ProfileInfo />
                    </Suspense>
                </CardSection>
                <CardSection
                    title="Connected Accounts"
                    description="Manage your connected services"
                >
                    <ConnectedAccount />
                </CardSection>
                <Suspense fallback={<ChangePasswordFormSkeleton />}>
                    <ChangePasswordForm />
                </Suspense>
                <CardSection
                    title="Social Links"
                    description="Add links to your website and social media profiles"
                >
                    <SocialLinks />
                </CardSection>
            </div>
        </AccountLayout>
    );
}
