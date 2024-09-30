import { cn } from "@/lib/utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted-foreground/30 duration-700",
                className,
            )}
            {...props}
        />
    );
}

export { Skeleton };
