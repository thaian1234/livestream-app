import { SignUpForm } from "@/lib/features/auth/components/signup-form";
import { AuthLayout } from "@/lib/features/auth/layouts/auth.layout";

export default function SignUpPage() {
    return (
        <AuthLayout
            title="Sign Up"
            subTitle="Just some details to get you in !"
            isSignUp
        >
            <SignUpForm />
        </AuthLayout>
    );
}
