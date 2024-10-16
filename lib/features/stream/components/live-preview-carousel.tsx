import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { cardData } from "./live-preview";
import { LivePreviewCard } from "./live-preview-card";

export function LivePreviewCarousel() {
    const { isOpenSidebar } = useSidebar();

    return (
        <div className="w-7/12 md:w-9/12 xl:w-10/12 2xl:w-11/12">
            <Carousel>
                <CarouselContent>
                    {cardData.slice(0, 5).map((card, index) => (
                        <CarouselItem
                            key={index}
                            className={cn(
                                "",
                                isOpenSidebar
                                    ? "2xl:basis-1/2"
                                    : "xl:basis-1/2 2xl:basis-1/3",
                            )}
                        >
                            <LivePreviewCard
                                id={card.id}
                                title={card.title}
                                userName={card.userName}
                                thumnail={card.thumnail}
                                category={card.category}
                                viewers={card.viewers}
                                avatar={card.avatar}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
