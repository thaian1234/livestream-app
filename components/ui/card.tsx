import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-full flex-col px-8 pb-6 pt-10 font-sans text-white shadow-sm",
            className,
        )}
        {...props}
    />
));
Card.displayName = "Card";

const CardBody = React.forwardRef<
    //container
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props} />
));
CardBody.displayName = "CardBody";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-3xl font-semibold leading-none tracking-tight",
            className,
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle"; //text

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 pb-5", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    //contai
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("my-3 flex flex-col space-y-3", className)}
        {...props}
    />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    //container
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col items-center", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardContent,
    CardBody,
    CardDescription,
};
