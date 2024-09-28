"use client";

import { GoogleButton } from "../../auth/components/google-button";
import {
    AlertCircle,
    Github,
    Globe,
    Instagram,
    Mail,
    Twitter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Simulated server action
async function updateAccount(formData: FormData) {
    // In a real application, this would be a server action
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network request
    return { success: true };
}

export function AccountUpdateForm() {
    const [isLoading, setIsLoading] = useState(false);

    const handleProviderConnect = (provider: string) => {
        // In a real application, this would initiate OAuth flow
    };

    return (
        // <form onSubmit={onSubmit}>
        //     <div className="grid grid-cols-1 gap-6 md:grid-cols-2"></div>

        //     <div className="mt-6">
        //         <Button
        //             type="submit"
        //             disabled={isLoading}
        //             className="w-full md:w-auto"
        //         >
        //             {isLoading ? "Updating..." : "Update Account"}
        //         </Button>
        //     </div>
        // </form>
        <div></div>
    );
}
