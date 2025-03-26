import { AboutTabs } from "@/lib/components/about/about-tabs";
import { Infor } from "@/lib/components/about/infor";

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-4">
            <Infor />
            <AboutTabs />
        </div>
    );
}
