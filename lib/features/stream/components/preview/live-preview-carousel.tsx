import { useSidebar } from "@/lib/stores/store-sidebar";
import { cn } from "@/lib/utils";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { streamApi } from "../../apis";
import { LivePreviewCard } from "./live-preview-card";

export function LivePreviewCarousel() {
    const { isOpenSidebar } = useSidebar();
    const { data, isPending, isError } = streamApi.query.useGetDefaultStreams(
        {},
    );

    if (isPending) {
        return <p>Loading stream...</p>;
    }
    if (!data || isError) {
        return <p>Cannot fetch Streams</p>;
    }
    const recommendStreams = data.data.recommends.data;

    return (
        <div className="w-7/12 md:w-9/12 xl:w-10/12 2xl:w-11/12">
            <Carousel>
                <CarouselContent>
                    {recommendStreams?.slice(0, 5).map((card, index) => (
                        <CarouselItem
                            key={index}
                            className={cn(
                                "",
                                isOpenSidebar
                                    ? "2xl:basis-1/2"
                                    : "xl:basis-1/2 2xl:basis-1/3",
                            )}
                        >
                            {/* <LivePreviewCard
                                id={card.id}
                                isLive={card.isLive}
                                name={card.name}
                                thumbnailUrl={card.thumbnailUrl}
                                user={card.user}
                                userId={card.userId}
                            /> */}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
