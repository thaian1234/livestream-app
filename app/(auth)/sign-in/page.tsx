import { SignInForm } from "@/lib/cores/auth/signin-form";
import { AuthContainer } from "@/lib/features/auth/auth-container";

export default function Page() {
    return (
        <AuthContainer isSignUp={false}>
            <SignInForm />
        </AuthContainer>
    );
}
