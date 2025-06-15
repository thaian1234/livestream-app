"use client";

import { forwardRef, useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

interface MoneyInputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "value" | "onChange"
    > {
    value?: number;
    onChange?: (value: number) => void;
    currency?: string;
    locale?: string;
    min?: number;
    max?: number;
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
    (
        {
            value = 0,
            onChange,
            currency = "VND",
            locale = "vi-VN",
            min = 0,
            max = Number.MAX_SAFE_INTEGER,
            className,
            placeholder,
            ...props
        },
        ref,
    ) => {
        const [displayValue, setDisplayValue] = useState("");
        const [isFocused, setIsFocused] = useState(false);

        const formatCurrency = useCallback(
            (num: number): string => {
                if (num === 0) return "";
                return new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(num);
            },
            [locale, currency],
        );

        // Parse currency string to number
        const parseCurrency = (str: string): number => {
            if (!str) return 0;
            const cleanStr = str.replace(/[^\d]/g, "");
            const num = parseInt(cleanStr) || 0;
            return Math.min(Math.max(num, min), max);
        };

        // Update display value when value prop changes
        useEffect(() => {
            if (!isFocused) {
                setDisplayValue(value > 0 ? formatCurrency(value) : "");
            }
        }, [value, isFocused, currency, locale, formatCurrency]);

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            // Show raw number when focused
            setDisplayValue(value > 0 ? value.toString() : "");
            props.onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            const numValue = parseCurrency(displayValue);

            // Update parent with parsed value
            onChange?.(numValue);

            // Format display value
            setDisplayValue(numValue > 0 ? formatCurrency(numValue) : "");
            props.onBlur?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            if (isFocused) {
                // When focused, allow only numbers
                const cleanValue = inputValue.replace(/[^\d]/g, "");
                setDisplayValue(cleanValue);

                const numValue = parseInt(cleanValue) || 0;
                const clampedValue = Math.min(Math.max(numValue, min), max);
                onChange?.(clampedValue);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            // Allow: backspace, delete, tab, escape, enter
            if (
                ["Backspace", "Delete", "Tab", "Escape", "Enter"].includes(
                    e.key,
                ) ||
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.key === "a" && e.ctrlKey) ||
                (e.key === "c" && e.ctrlKey) ||
                (e.key === "v" && e.ctrlKey) ||
                (e.key === "x" && e.ctrlKey)
            ) {
                return;
            }
            // Allow navigation keys and modifiers
            if (e.key.length === 1 && !/^\d$/.test(e.key)) {
                e.preventDefault();
            }
            props.onKeyDown?.(e);
        };

        return (
            <Input
                {...props}
                ref={ref}
                type="text"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || `Enter amount in ${currency}`}
                className={cn("font-mono", className)}
                aria-label={`Money input in ${currency}`}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
            />
        );
    },
);

MoneyInput.displayName = "MoneyInput";
