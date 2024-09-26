import { AccountLayout } from "@/lib/components/dashboard/account/account.layout";
import { ProfileUpdateForm } from "@/lib/features/user/components/profile-update.form";

export default function AccountPage() {
    return (
        <AccountLayout title="Account" subTitle="Update your account settings.">
            <ProfileUpdateForm />
        </AccountLayout>
    );
}
