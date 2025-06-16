"use client";

import { createContext, useContext } from "react";
import React, { useMemo } from "react";

import { StreamDTO } from "@/server/api/dtos/stream.dto";
import { UserDTO } from "@/server/api/dtos/user.dto";

import { authApi } from "../features/auth/apis";

type AuthContextType = {
    user?: UserDTO.Select;
    stream?: StreamDTO.Select;
    isPending: boolean;
    error: Error | null;
    isSignedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data, isPending, error } = authApi.query.useVerifySession();
    const isSignedIn = !isPending && !error;

    const contextValue = useMemo(
        () => ({
            error,
            isPending,
            isSignedIn,
            user: data?.data.user,
            stream: data?.data.user.stream,
        }),
        [error, isPending, isSignedIn, data?.data.user],
    );

    if (isPending) return null;

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
