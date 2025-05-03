import AnalysisTabs from "@/lib/features/donation/components/analysis-tabs";
import { CurrentPackages } from "@/lib/features/donation/components/current-packages";

export default function DonationPage() {
    return (
        <div className="mx-auto space-y-8 py-8">
            <h1 className="text-3xl font-bold">Manage Donation</h1>
            <AnalysisTabs />
            <CurrentPackages />
        </div>
    );
}
