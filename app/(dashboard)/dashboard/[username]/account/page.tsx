import { AccountLayout } from "@/lib/components/dashboard/account/account.layout";
import { ChangePasswordForm } from "@/lib/features/auth/components/change-password-form";
import { ConnectedAccount } from "@/lib/features/auth/components/connected-account";
import { ProfileInfo } from "@/lib/features/user/components/profile-info";
import { SocialLinks } from "@/lib/features/user/components/social-links";

export default function AccountPage() {
    return (
        <AccountLayout title="Account" subTitle="Update your account settings">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ProfileInfo />
                <ConnectedAccount />
                <ChangePasswordForm />
                <SocialLinks />
            </div>
        </AccountLayout>
    );
}
