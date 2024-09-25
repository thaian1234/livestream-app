import { authApi } from "../apis";

interface SignOutButtonProps {
    children: React.ReactNode;
}

export function SignOutButton({ children }: SignOutButtonProps) {
    const { mutate, isPending } = authApi.mutation.useSignOut();
    return (
        <button onClick={mutate} disabled={isPending} className="w-full">
            {children}
        </button>
    );
}
