"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

interface SecretInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function SecretInput({
    className,
    leftIcon,
    rightIcon,
    ...props
}: SecretInputProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            {leftIcon && (
                <div className="absolute left-3 top-1/2 z-50 -translate-y-1/2 text-muted-foreground">
                    {leftIcon}
                </div>
            )}
            <Input
                type={showPassword ? "text" : "password"}
                className={cn(
                    leftIcon && "pl-12",
                    !props.readOnly && "pr-12",
                    rightIcon && "pr-20",
                    className,
                )}
                {...props}
            />
            {rightIcon ? (
                <div className="absolute right-3 top-1/2 z-50 flex -translate-y-1/2 space-x-4 text-muted-foreground">
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOff className="size-5 text-muted-foreground" />
                        ) : (
                            <Eye className="size-5 text-muted-foreground" />
                        )}
                    </button>
                    {rightIcon}
                </div>
            ) : (
                !props.readOnly && (
                    <button
                        type="button"
                        className="absolute right-0 top-0 z-50 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOff className="size-5 text-muted-foreground" />
                        ) : (
                            <Eye className="size-5 text-muted-foreground" />
                        )}
                    </button>
                )
            )}
        </div>
    );
}
