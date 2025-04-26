import { CurrentPackages } from "@/lib/features/donation/components/current-packages";
import { Payment } from "@/lib/features/donation/components/payment";

export default function DonationPage() {
    return (
        <div className="mx-auto space-y-8 py-8">
            <h1 className="text-3xl font-bold">Manage Donation Packages</h1>
            <Payment />
            <CurrentPackages />
        </div>
    );
}
