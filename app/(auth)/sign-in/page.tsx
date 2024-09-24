import { SignInForm } from "@/lib/features/auth/components/signin-form";
import { AuthLayout } from "@/lib/features/auth/layouts/auth.layout";

export default function SignInPage() {
    return (
        <AuthLayout
            title="Sign In"
            subTitle="Glad you’re back!"
            isSignUp={false}
        >
            <SignInForm />
        </AuthLayout>
    );
}
