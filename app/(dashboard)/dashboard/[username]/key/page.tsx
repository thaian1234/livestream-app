import { InstructionGuide } from "@/lib/features/setting/components/instruction-guide";
import { KeyForm } from "@/lib/features/setting/components/key-update-form";

export default function KeyPage() {
    return (
        <section className="container mb-12 mt-10 grid sm:gap-y-8 lg:grid-cols-2 lg:space-x-8">
            <InstructionGuide />
            <KeyForm />
        </section>
    );
}
