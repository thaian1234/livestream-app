"use client";

import { Check, LockIcon, X } from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { AuthDTO } from "@/server/api/dtos/auth.dto";

import { SecretInput } from "./secret-input";

const passwordRequirements = [
    {
        validator: (pass: string) => !/\s/.test(pass),
        text: "No spaces allowed",
    },
    {
        validator: (pass: string) => /^.{6,16}$/.test(pass),
        text: "Must be 6-16 characters long",
    },
    {
        validator: (pass: string) => /[0-9]/.test(pass),
        text: "At least 1 number (1-9)",
    },
    {
        validator: (pass: string) => /[a-z]/.test(pass),
        text: "At least 1 lowercase letter",
    },
    {
        validator: (pass: string) => /[A-Z]/.test(pass),
        text: "At least 1 uppercase letter",
    },
    {
        validator: (pass: string) => /[@$!%*?&]/.test(pass),
        text: "At least 1 special character (@$!%*?&)",
    },
] as const;

const passwordSchema = AuthDTO.passwordSchema;

export interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    showStrengthIndicator?: boolean;
    onStrengthChange?: (score: number) => void;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    (
        { className, showStrengthIndicator = true, onStrengthChange, ...props },
        ref,
    ) => {
        const [value, setValue] = React.useState("");

        const validationResult = React.useMemo(() => {
            return passwordRequirements.map((req) => ({
                met: req.validator(value),
                text: req.text,
            }));
        }, [value]);

        const strengthScore = React.useMemo(() => {
            const result = passwordSchema.safeParse(value);
            if (result.success) return 6;
            return validationResult.filter((req) => req.met).length;
        }, [value, validationResult]);

        React.useEffect(() => {
            onStrengthChange?.(strengthScore);
        }, [strengthScore, onStrengthChange]);

        const getStrengthColor = (score: number) => {
            if (score === 0) return "bg-border";
            if (score <= 2) return "bg-red-500";
            if (score <= 4) return "bg-orange-500";
            if (score === 5) return "bg-amber-500";
            return "bg-emerald-500"; // Will show green at score 6
        };

        return (
            <div className="space-y-2">
                <div className="relative">
                    <SecretInput
                        {...props}
                        ref={ref}
                        leftIcon={<LockIcon className="size-5" />}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            props.onChange?.(e);
                        }}
                        className="border border-white bg-black-0"
                    />
                </div>

                {showStrengthIndicator && (
                    <>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500",
                                    getStrengthColor(strengthScore),
                                )}
                                style={{
                                    width: `${(strengthScore / 6) * 100}%`,
                                }}
                            />
                        </div>
                        <ul className="space-y-1.5 text-sm">
                            {validationResult.map((req, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    {req.met ? (
                                        <Check
                                            size={16}
                                            className="text-emerald-500"
                                        />
                                    ) : (
                                        <X
                                            size={16}
                                            className="text-muted-foreground/80"
                                        />
                                    )}
                                    <span
                                        className={cn(
                                            "text-xs",
                                            req.met
                                                ? "text-emerald-600"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        {req.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        );
    },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
