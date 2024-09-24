"use client";

import { authApi } from "../features/auth/apis";
import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

import { UserValidation } from "@/server/api/lib/validations/schema.validation";

type AuthContextType = {
    user: UserValidation.Select | null;
    isPending: boolean;
    error: Error | null;
    isSignedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data, isPending, error } = authApi.query.useVerifySession();
    const contextValue = useMemo(() => {
        const isSignedIn = !isPending && !error;
        return {
            user: data?.data.user ? data.data.user : null,
            isPending,
            error,
            isSignedIn,
        };
    }, [data, isPending, error]);
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a SessionProvider");
    }
    return context;
};
