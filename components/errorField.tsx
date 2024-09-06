import * as React from "react"

import { cn } from "@/lib/utils"
const ErrorField = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			" font-normal text-sm leading-none tracking-tight text-red !mt-1",
			className
		)}
		{...props}
	/>
))
ErrorField.displayName = "ErrorField" //text
export { ErrorField }
