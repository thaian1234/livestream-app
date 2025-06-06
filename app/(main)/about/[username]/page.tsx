import { AboutTabs } from "@/lib/components/about/about-tabs";
import { Infor } from "@/lib/components/about/infor";

export default function AboutPage() {
    return (
        <div className="flex w-full flex-col gap-[200px] pb-10 sm:gap-[150px] lg:gap-3 lg:px-6">
            <Infor />
            <AboutTabs />
        </div>
    );
}
