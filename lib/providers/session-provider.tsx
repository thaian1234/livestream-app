"use client";

import { Fetcher } from "../helpers/fetcher";
import { createContext, useContext, useMemo } from "react";

import { client } from "@/server/api/client";
import { HttpStatus } from "@/server/api/lib/constant/http.type";
import { UserValidation } from "@/server/api/lib/validations/schema.validation";

type SessionContextType = {
    user?: UserValidation.Select;
    isLoading: boolean;
    error: Error | null;
    isSignedIn: boolean;
    isSignedOut: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const $get = client.api.auth["verify-session"].$get;
    const { data, isLoading, error } = Fetcher.useHonoQuery($get, ["user"], {
        refetchOnWindowFocus: false,
        staleTime: 60 * 60 * 5,
    });

    const contextValue = useMemo(() => {
        const isSignedIn = data?.status === HttpStatus.OK && !!data?.data.user;
        const isSignedOut = !isLoading && !isSignedIn;

        return {
            user: data?.data.user,
            isLoading,
            error,
            isSignedIn,
            isSignedOut,
        };
    }, [data, isLoading, error]);

    return (
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};
