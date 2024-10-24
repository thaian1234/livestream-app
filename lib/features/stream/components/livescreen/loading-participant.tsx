import Image from "next/image";

import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

export function LoadingParticipant() {
    const { isHideSidebar, isOpenSidebar } = useSidebar();

    return (
        <div className="relative">
            <div
                className={cn(
                    "max-w-auto max-h-[calc(100vh-10rem)] w-full cursor-pointer rounded-xl bg-white/25",
                    isOpenSidebar === false ? "aspect-[2/1]" : "aspect-[16/9]",
                    isHideSidebar && "aspect-[16/9] max-h-[calc(100vh-5rem)]", //cinema mode
                )}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                <Image
                    src="/logoipsum-330.svg"
                    className="logoContainer"
                    width={100}
                    height={100}
                    alt="Logo"
                />
            </div>
        </div>
    );
}
