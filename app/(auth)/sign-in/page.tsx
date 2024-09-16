import { SignInForm } from "@/lib/cores/auth/components/signin-form";
import { AuthLayout } from "@/lib/cores/auth/layouts/auth.layout";

import "@/style/auth.css";

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
