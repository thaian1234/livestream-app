"use client";

import { clientAPI } from "../features";
import { createContext, useContext, useMemo } from "react";

import { UserValidation } from "@/server/api/lib/validations/schema.validation";

type AuthContextType = {
    user: UserValidation.Select | null;
    isLoading: boolean;
    error: Error | null;
    isSignedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data, isLoading, error } = clientAPI.auth.useVerifySession();

    const contextValue = useMemo(() => {
        const isSignedIn = !isLoading && !error && !!data?.data.user;

        return {
            user: isSignedIn ? data.data.user : null,
            isLoading,
            error,
            isSignedIn,
        };
    }, [data, isLoading, error]);

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
