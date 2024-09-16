import { SignUpForm } from "@/lib/cores/auth/components/signup-form";
import { AuthLayout } from "@/lib/cores/auth/layouts/auth.layout";

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
