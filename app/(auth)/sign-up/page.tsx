import { SignUpForm } from "@/lib/cores/auth/signup-form";
import { AuthContainer } from "@/lib/features/auth/auth-container";

export default function Page() {
    return (
        <AuthContainer isSignUp={true}>
            <SignUpForm />
        </AuthContainer>
    );
}
