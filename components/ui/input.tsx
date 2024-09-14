import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
	"flex h-10 w-full rounded-md border bg-background px-3 py-2 hover:opacity-80  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-2  disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "border-input focus-visible:ring-ring text-white",
				primary: "border-white focus-visible:ring-teal-2 text-white placeholder:text-white bg-black-0",
				error: "border-red-500 focus-visible:ring-red-500 text-red-500 placeholder:text-white bg-black-0"
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
	}
)

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
	VariantProps<typeof inputVariants> {
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, type, customSize, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ variant, className, customSize }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Input.displayName = "Input"

export { Input };