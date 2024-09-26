import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface Props {
    children: React.ReactNode; // Chỉ nhận các component React
    content: String;
    side: "top" | "bottom" | "left" | "right"; // Chọn vị trí hiển thị tooltip (top, bottom, left, right)
}
export function TooltipModel({ children, content, side }: Props) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side}>
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
