import { Children } from "react";

interface BackGroundProps {
    children: React.ReactNode;
}
export function Background({ children }: BackGroundProps) {
    return (
        <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#0f0f0f]">
            <div className="round-[413.821px] sm:round-[1039.978px] absolute left-0 top-1/2 h-[395.053px] w-[413.821px] shrink-0 translate-x-[-50%] translate-y-[-40%] rotate-[-2.314deg] bg-teal-2 opacity-30 blur-[160px] sm:top-0 sm:h-[902.587px] sm:w-[1039.978px] sm:translate-y-[-50%] sm:rotate-[-1.776deg]"></div>

            {/* <div className="sm:round-[1206.359px] round-[541.429px] absolute right-0 top-0 h-[541.429px] w-[324.745px] shrink-0 translate-x-[36%] translate-y-[-13%] rotate-[-0.606deg] bg-teal-1 opacity-30 blur-[160px] sm:h-[977.895px] sm:w-[1206.359px] sm:translate-x-[50%] sm:translate-y-[-50%] sm:rotate-[-1.776deg]"></div> */}

            <div className="round-[1039.978px] absolute bottom-0 left-1/2 h-[225.831px] w-[236.091px] shrink-0 translate-x-[-50%] translate-y-[5%] rotate-[-0.606deg] bg-teal-3 opacity-30 blur-[160px] sm:h-[799.436px] sm:w-[1039.978px] sm:translate-y-[65%] sm:rotate-[-1.776deg]"></div>

            {children}
        </div>
    );
}
