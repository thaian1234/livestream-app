import { Suspense } from "react";

import { AccountLayout } from "@/lib/components/dashboard/account/account.layout";
import { ConnectedAccount } from "@/lib/features/auth/components/connected-account";
import { ChangePasswordForm } from "@/lib/features/user/components/change-password-form";
import { ProfileInfo } from "@/lib/features/user/components/profile-info";
import { SocialLinks } from "@/lib/features/user/components/social-links";

export default function AccountPage() {
    return (
        <AccountLayout title="Account" subTitle="Update your account settings">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Suspense fallback={<p>Loading...</p>}>
                    <ProfileInfo />
                </Suspense>
                <ConnectedAccount />
                <Suspense fallback={<p>Loading...</p>}>
                    <ChangePasswordForm />
                </Suspense>
                <SocialLinks />
            </div>
        </AccountLayout>
    );
}
