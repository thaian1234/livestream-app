import * as React from "react";

import { cn } from "@/lib/utils";

const ErrorField = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "!mt-1 text-sm font-normal leading-none tracking-tight text-red-500",
            className,
        )}
        {...props}
    />
));
ErrorField.displayName = "ErrorField"; //text
export { ErrorField };
