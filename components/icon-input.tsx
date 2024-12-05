import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

interface IconProps {
    children: React.ReactNode;
}
function LeftIcon({ children }: IconProps) {
    return (
        <div className="item-center absolute left-3 top-1/2 z-10 flex -translate-y-1/2 transform justify-center">
            {children}
        </div>
    );
}

function RightIcon({ children }: IconProps) {
    return (
        <div className="item-center absolute right-3 top-1/2 flex -translate-y-1/2 transform justify-center">
            {children}
        </div>
    );
}
const inputVariants = cva(
    "flex h-10 w-full rounded-md border bg-background px-3 py-2 hover:opacity-80  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "border-input focus-visible:ring-ring text-white",
                primary:
                    "border-white focus-visible:ring-teal-2 text-white bg-black-0",
                error: "border-red-500 focus-visible:ring-red-500 text-red-500 bg-black-0",
            },
            customSize: {
                default: "h-10 px-3.5 text-base",
                sm: "h-9 rounded-md px-3 text-sm",
                lg: "h-11 rounded-md px-4 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            customSize: "default",
        },
    },
);

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {}

const IconInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant, type, customSize, children, ...props }, ref) => {
        const leftIcon = React.Children.toArray(children).find(
            (child) => React.isValidElement(child) && child.type === LeftIcon,
        );
        const rightIcon = React.Children.toArray(children).find(
            (child) => React.isValidElement(child) && child.type === RightIcon,
        );
        return (
            <div className="relative">
                {leftIcon}
                <input
                    type={type}
                    className={cn(
                        inputVariants({ variant, className, customSize }),
                    )}
                    ref={ref}
                    {...props}
                />

                {rightIcon}
            </div>
        );
    },
);
IconInput.displayName = "IconInput";

export { IconInput, LeftIcon, RightIcon };
