"use client";

import { authApi } from "../features/auth/apis";
import { createContext, useContext } from "react";
import React, { useMemo } from "react";

import { UserValidation } from "@/server/api/lib/validations/schema.validation";

type AuthContextType = {
    user?: UserValidation.Select;
    isPending: boolean;
    error: Error | null;
    isSignedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data, isPending, error } = authApi.query.useVerifySession();
    const isSignedIn = !error;

    const contextValue = useMemo(
        () => ({
            error,
            isPending,
            isSignedIn,
            user: data?.data.user,
        }),
        [error, isPending, isSignedIn, data?.data.user],
    );

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
